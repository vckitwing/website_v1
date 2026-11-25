import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, computed, inject, signal, viewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService, errorMessage } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { Milestone, Status } from '../../core/models';

const NOT_BLANK = Validators.pattern(/\S/);
const YEAR = Validators.pattern(/^(19[89]\d|20\d\d|2100)$/);

@Component({
  selector: 'adm-history',
  imports: [ReactiveFormsModule, DatePipe],
  templateUrl: './history.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HistoryComponent {
  private readonly api = inject(ApiService);
  readonly auth = inject(AuthService);

  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');

  readonly items = signal<Milestone[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');
  readonly formError = signal('');
  readonly saving = signal(false);
  readonly filter = signal<'all' | Status>('all');
  readonly editing = signal<Milestone | null>(null);

  readonly visible = computed(() => this.items().filter((m) => this.filter() === 'all' || m.status === this.filter()));
  readonly counts = computed(() => ({
    published: this.items().filter((m) => m.status === 'published').length,
    draft: this.items().filter((m) => m.status === 'draft').length
  }));

  readonly form = inject(FormBuilder).nonNullable.group({
    year: ['', [Validators.required, YEAR]],
    title_en: ['', [Validators.required, NOT_BLANK, Validators.maxLength(200)]],
    title_ta: ['', [Validators.required, NOT_BLANK, Validators.maxLength(200)]],
    description_en: ['', [Validators.required, NOT_BLANK, Validators.maxLength(2000)]],
    description_ta: ['', [Validators.required, NOT_BLANK, Validators.maxLength(2000)]],
    source_url: ['', [Validators.pattern(/^(https?:\/\/\S+)?$/)]],
    source_label_en: [''],
    source_label_ta: [''],
    position: [0],
    status: ['draft' as Status]
  });

  constructor() {
    void this.load();
  }

  canChange(item: Milestone): boolean {
    return this.auth.canPublish() || item.status === 'draft';
  }

  async load(): Promise<void> {
    this.loading.set(true);
    this.error.set('');
    try {
      this.items.set(await this.api.history());
    } catch (error) {
      this.error.set(errorMessage(error));
    } finally {
      this.loading.set(false);
    }
  }

  openForm(item: Milestone | null): void {
    this.editing.set(item);
    this.formError.set('');
    this.form.reset(
      item
        ? {
            year: item.year,
            title_en: item.title_en,
            title_ta: item.title_ta,
            description_en: item.description_en,
            description_ta: item.description_ta,
            source_url: item.source_url ?? '',
            source_label_en: item.source_label_en ?? '',
            source_label_ta: item.source_label_ta ?? '',
            position: item.position,
            status: item.status
          }
        : { year: '', title_en: '', title_ta: '', description_en: '', description_ta: '', source_url: '', source_label_en: '', source_label_ta: '', position: 0, status: 'draft' }
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
    const v = this.form.getRawValue();
    const url = v.source_url.trim();
    const body = {
      ...v,
      year: v.year.trim(),
      title_en: v.title_en.trim(),
      title_ta: v.title_ta.trim(),
      description_en: v.description_en.trim(),
      description_ta: v.description_ta.trim(),
      source_url: url || null,
      source_label_en: url ? v.source_label_en.trim() || null : null,
      source_label_ta: url ? v.source_label_ta.trim() || null : null
    };
    const current = this.editing();
    try {
      const { status, ...withoutStatus } = body;
      const saved = current
        ? await this.api.updateMilestone(current.id, this.auth.canPublish() ? body : withoutStatus)
        : await this.api.createMilestone(this.auth.canPublish() ? body : { ...withoutStatus, status: 'draft' });
      this.items.update((list) => (current ? list.map((m) => (m.id === saved.id ? saved : m)) : [...list, saved]).sort(byYear));
      this.closeForm();
    } catch (error) {
      this.formError.set(errorMessage(error));
    } finally {
      this.saving.set(false);
    }
  }

  async setStatus(item: Milestone, status: Status): Promise<void> {
    this.error.set('');
    try {
      const saved = await this.api.updateMilestone(item.id, { status });
      this.items.update((list) => list.map((m) => (m.id === saved.id ? saved : m)));
    } catch (error) {
      this.error.set(errorMessage(error));
    }
  }

  async remove(item: Milestone): Promise<void> {
    if (!confirm(`Delete “${item.title_en}” (${item.year})? This cannot be undone.`)) return;
    this.error.set('');
    try {
      await this.api.deleteMilestone(item.id);
      this.items.update((list) => list.filter((m) => m.id !== item.id));
    } catch (error) {
      this.error.set(errorMessage(error));
    }
  }

  onFilter(event: Event): void {
    this.filter.set((event.target as HTMLSelectElement).value as 'all' | Status);
  }
}

function byYear(a: Milestone, b: Milestone): number {
  return a.year.localeCompare(b.year) || a.position - b.position || a.id - b.id;
}
