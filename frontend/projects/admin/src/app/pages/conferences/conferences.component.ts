import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, computed, inject, signal, viewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService, errorMessage } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { Conference, Status } from '../../core/models';

const NOT_BLANK = Validators.pattern(/\S/);

@Component({
  selector: 'adm-conferences',
  imports: [ReactiveFormsModule, DatePipe],
  templateUrl: './conferences.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConferencesComponent {
  private readonly api = inject(ApiService);
  readonly auth = inject(AuthService);

  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');

  readonly items = signal<Conference[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');
  readonly formError = signal('');
  readonly saving = signal(false);
  readonly filter = signal<'all' | Status>('all');
  readonly search = signal('');
  readonly editing = signal<Conference | null>(null);

  readonly visible = computed(() => {
    const term = this.search().trim().toLowerCase();
    return this.items().filter(
      (c) =>
        (this.filter() === 'all' || c.status === this.filter()) &&
        (!term || `${c.year} ${c.name_en} ${c.name_ta}`.toLowerCase().includes(term))
    );
  });
  readonly counts = computed(() => ({
    published: this.items().filter((c) => c.status === 'published').length,
    draft: this.items().filter((c) => c.status === 'draft').length
  }));

  readonly form = inject(FormBuilder).nonNullable.group({
    year: [new Date().getFullYear(), [Validators.required, Validators.min(1982), Validators.max(2100)]],
    name_en: ['', [Validators.required, NOT_BLANK, Validators.maxLength(300)]],
    name_ta: ['', [Validators.required, NOT_BLANK, Validators.maxLength(300)]],
    position: [0],
    status: ['draft' as Status]
  });

  constructor() {
    void this.load();
  }

  /** Contributors may only change drafts; editors and super admins may change anything. */
  canChange(item: Conference): boolean {
    return this.auth.canPublish() || item.status === 'draft';
  }

  async load(): Promise<void> {
    this.loading.set(true);
    this.error.set('');
    try {
      this.items.set(await this.api.conferences());
    } catch (error) {
      this.error.set(errorMessage(error));
    } finally {
      this.loading.set(false);
    }
  }

  openForm(item: Conference | null): void {
    this.editing.set(item);
    this.formError.set('');
    this.form.reset(
      item
        ? { year: item.year, name_en: item.name_en, name_ta: item.name_ta, position: item.position, status: item.status }
        : { year: new Date().getFullYear(), name_en: '', name_ta: '', position: 0, status: 'draft' }
    );
    this.dialog().nativeElement.showModal();
  }

  closeForm(): void {
    this.dialog().nativeElement.close();
  }

  async save(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving.set(true);
    this.formError.set('');
    const value = this.form.getRawValue();
    const body = { ...value, name_en: value.name_en.trim(), name_ta: value.name_ta.trim() };
    const current = this.editing();
    try {
      // a contributor never sends a status; the server keeps (or sets) draft
      const { status, ...withoutStatus } = body;
      const saved = current
        ? await this.api.updateConference(current.id, this.auth.canPublish() ? body : withoutStatus)
        : await this.api.createConference(this.auth.canPublish() ? body : { ...withoutStatus, status: 'draft' });
      this.items.update((list) => (current ? list.map((c) => (c.id === saved.id ? saved : c)) : [...list, saved]).sort(byYear));
      this.closeForm();
    } catch (error) {
      this.formError.set(errorMessage(error));
    } finally {
      this.saving.set(false);
    }
  }

  async setStatus(item: Conference, status: Status): Promise<void> {
    this.error.set('');
    try {
      const saved = await this.api.updateConference(item.id, { status });
      this.items.update((list) => list.map((c) => (c.id === saved.id ? saved : c)));
    } catch (error) {
      this.error.set(errorMessage(error));
    }
  }

  async remove(item: Conference): Promise<void> {
    if (!confirm(`Delete “${item.name_en}” (${item.year})? This cannot be undone.`)) return;
    this.error.set('');
    try {
      await this.api.deleteConference(item.id);
      this.items.update((list) => list.filter((c) => c.id !== item.id));
    } catch (error) {
      this.error.set(errorMessage(error));
    }
  }

  onSearch(event: Event): void {
    this.search.set((event.target as HTMLInputElement).value);
  }

  onFilter(event: Event): void {
    this.filter.set((event.target as HTMLSelectElement).value as 'all' | Status);
  }
}

function byYear(a: Conference, b: Conference): number {
  return a.year - b.year || a.position - b.position || a.id - b.id;
}
