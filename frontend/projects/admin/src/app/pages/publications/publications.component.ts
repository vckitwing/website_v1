import { HttpEventType } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, computed, inject, signal, viewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService, errorMessage } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { Edition, Publication, PublicationKind, Status } from '../../core/models';

const NOT_BLANK = Validators.pattern(/\S/);
const SLUG = Validators.pattern(/^[a-z0-9]+(-[a-z0-9]+)*$/);
const MAX_PDF_BYTES = 80 * 1024 * 1024;
const POLL_MS = 2000;

export const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

@Component({
  selector: 'adm-publications',
  imports: [ReactiveFormsModule],
  templateUrl: './publications.component.html',
  styleUrl: './publications.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PublicationsComponent {
  private readonly api = inject(ApiService);
  readonly auth = inject(AuthService);
  private readonly fb = inject(FormBuilder);

  private readonly publicationDialog = viewChild.required<ElementRef<HTMLDialogElement>>('publicationDialog');
  private readonly uploadDialog = viewChild.required<ElementRef<HTMLDialogElement>>('uploadDialog');
  private readonly editionDialog = viewChild.required<ElementRef<HTMLDialogElement>>('editionDialog');
  private readonly fileInput = viewChild<ElementRef<HTMLInputElement>>('fileInput');

  readonly months = MONTHS;
  readonly items = signal<Publication[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');
  /** While any edition is being turned into page pictures the list refreshes by itself. */
  readonly anyProcessing = computed(() => this.items().some((p) => p.editions.some((e) => e.state === 'processing')));

  // ---- publication form ----
  readonly editingPublication = signal<Publication | null>(null);
  readonly publicationError = signal('');
  readonly publicationSaving = signal(false);
  private slugEdited = false;
  readonly publicationForm = this.fb.nonNullable.group({
    slug: ['', [Validators.required, SLUG, Validators.maxLength(60)]],
    kind: ['book' as PublicationKind],
    title_en: ['', [Validators.required, NOT_BLANK, Validators.maxLength(200)]],
    title_ta: ['', [Validators.required, NOT_BLANK, Validators.maxLength(200)]],
    description_en: ['', [Validators.required, NOT_BLANK, Validators.maxLength(2000)]],
    description_ta: ['', [Validators.required, NOT_BLANK, Validators.maxLength(2000)]],
    author_en: [''],
    author_ta: [''],
    status: ['draft' as Status]
  });

  // ---- upload ----
  readonly uploadFor = signal<Publication | null>(null);
  readonly file = signal<File | null>(null);
  readonly fileError = signal('');
  readonly uploadError = signal('');
  readonly uploading = signal(false);
  readonly uploadPercent = signal(0);
  readonly uploadForm = this.fb.nonNullable.group({
    label: ['', [Validators.required, NOT_BLANK, Validators.maxLength(120)]],
    volume: [null as number | null, [Validators.min(1), Validators.max(9999)]],
    issue_number: [null as number | null, [Validators.min(1), Validators.max(99999)]],
    year: [null as number | null, [Validators.min(1900), Validators.max(2100)]],
    month: [null as number | null, [Validators.min(1), Validators.max(12)]],
    watermark: [true]
  });

  // ---- edit an edition's details ----
  readonly editingEdition = signal<Edition | null>(null);
  readonly editionError = signal('');
  readonly editionSaving = signal(false);
  readonly editionForm = this.fb.nonNullable.group({
    label: ['', [Validators.required, NOT_BLANK, Validators.maxLength(120)]],
    volume: [null as number | null, [Validators.min(1), Validators.max(9999)]],
    issue_number: [null as number | null, [Validators.min(1), Validators.max(99999)]],
    year: [null as number | null, [Validators.min(1900), Validators.max(2100)]],
    month: [null as number | null, [Validators.min(1), Validators.max(12)]]
  });

  private pollTimer?: number;

  constructor() {
    void this.load();
    inject(DestroyRef).onDestroy(() => window.clearTimeout(this.pollTimer));
    this.schedulePoll();
  }

  // ---------------------------------------------------------------------------------------------------------------------
  private schedulePoll(): void {
    this.pollTimer = window.setTimeout(async () => {
      if (this.anyProcessing()) await this.refresh();
      this.schedulePoll();
    }, POLL_MS);
  }

  async load(): Promise<void> {
    this.loading.set(true);
    this.error.set('');
    await this.refresh(true);
    this.loading.set(false);
  }

  private async refresh(showError = false): Promise<void> {
    try {
      this.items.set(await this.api.publications());
    } catch (error) {
      if (showError) this.error.set(errorMessage(error));
    }
  }

  editionDate(edition: Edition): string {
    const parts: string[] = [];
    if (edition.volume) parts.push(`Vol ${edition.volume}`);
    if (edition.issue_number) parts.push(`Issue ${edition.issue_number}`);
    if (edition.month && edition.year) parts.push(`${MONTHS[edition.month - 1]} ${edition.year}`);
    else if (edition.year) parts.push(String(edition.year));
    return parts.join(' · ');
  }

  // ---- publications -------------------------------------------------------------------------------------------------
  openPublication(item: Publication | null): void {
    this.editingPublication.set(item);
    this.publicationError.set('');
    this.slugEdited = !!item;
    this.publicationForm.reset(
      item
        ? {
            slug: item.slug,
            kind: item.kind,
            title_en: item.title_en,
            title_ta: item.title_ta,
            description_en: item.description_en,
            description_ta: item.description_ta,
            author_en: item.author_en ?? '',
            author_ta: item.author_ta ?? '',
            status: item.status
          }
        : { slug: '', kind: 'book', title_en: '', title_ta: '', description_en: '', description_ta: '', author_en: '', author_ta: '', status: 'draft' }
    );
    // the kind cannot change once the publication exists
    if (item) this.publicationForm.controls.kind.disable();
    else this.publicationForm.controls.kind.enable();
    this.publicationDialog().nativeElement.showModal();
  }

  closePublication(): void {
    this.publicationDialog().nativeElement.close();
  }

  onTitleInput(): void {
    if (!this.slugEdited && !this.editingPublication()) {
      this.publicationForm.controls.slug.setValue(slugify(this.publicationForm.controls.title_en.value));
    }
  }

  onSlugInput(): void {
    this.slugEdited = true;
  }

  async savePublication(): Promise<void> {
    if (this.publicationForm.invalid) {
      this.publicationForm.markAllAsTouched();
      return;
    }
    this.publicationSaving.set(true);
    this.publicationError.set('');
    const v = this.publicationForm.getRawValue();
    const body = {
      slug: v.slug,
      kind: v.kind,
      title_en: v.title_en.trim(),
      title_ta: v.title_ta.trim(),
      description_en: v.description_en.trim(),
      description_ta: v.description_ta.trim(),
      author_en: v.author_en.trim() || null,
      author_ta: v.author_ta.trim() || null,
      status: v.status
    };
    const current = this.editingPublication();
    try {
      if (current) {
        const { kind, ...rest } = body;
        void kind;
        await this.api.updatePublication(current.id, rest);
      } else {
        await this.api.createPublication(body);
      }
      this.closePublication();
      await this.refresh(true);
    } catch (error) {
      this.publicationError.set(errorMessage(error));
    } finally {
      this.publicationSaving.set(false);
    }
  }

  async setPublicationStatus(item: Publication, status: Status): Promise<void> {
    this.error.set('');
    try {
      await this.api.updatePublication(item.id, { status });
      await this.refresh(true);
    } catch (error) {
      this.error.set(errorMessage(error));
    }
  }

  async removePublication(item: Publication): Promise<void> {
    const count = item.editions.length;
    const extra = count ? ` and its ${count} edition${count > 1 ? 's' : ''} with all page pictures` : '';
    if (!confirm(`Delete “${item.title_en}”${extra}? This cannot be undone.`)) return;
    this.error.set('');
    try {
      await this.api.deletePublication(item.id);
      await this.refresh(true);
    } catch (error) {
      this.error.set(errorMessage(error));
    }
  }

  // ---- upload an edition ---------------------------------------------------------------------------------------------
  openUpload(item: Publication): void {
    this.uploadFor.set(item);
    this.file.set(null);
    this.fileError.set('');
    this.uploadError.set('');
    this.uploadPercent.set(0);
    const monthly = item.kind === 'monthly';
    const now = new Date();
    this.uploadForm.reset({ label: monthly ? '' : 'First edition', volume: null, issue_number: null, year: monthly ? now.getFullYear() : null, month: monthly ? now.getMonth() + 1 : null, watermark: true });
    // a monthly issue always has a month and a year (they order the archive)
    const { year, month } = this.uploadForm.controls;
    year.setValidators(monthly ? [Validators.required, Validators.min(1900), Validators.max(2100)] : [Validators.min(1900), Validators.max(2100)]);
    month.setValidators(monthly ? [Validators.required, Validators.min(1), Validators.max(12)] : [Validators.min(1), Validators.max(12)]);
    year.updateValueAndValidity();
    month.updateValueAndValidity();
    const input = this.fileInput();
    if (input) input.nativeElement.value = '';
    this.uploadDialog().nativeElement.showModal();
  }

  closeUpload(): void {
    if (this.uploading()) return; // do not abandon a running upload
    this.uploadDialog().nativeElement.close();
  }

  onFile(event: Event): void {
    const chosen = (event.target as HTMLInputElement).files?.[0] ?? null;
    this.fileError.set('');
    this.file.set(null);
    if (!chosen) return;
    if (chosen.type !== 'application/pdf' && !chosen.name.toLowerCase().endsWith('.pdf')) {
      this.fileError.set('Choose a PDF file.');
      return;
    }
    if (chosen.size > MAX_PDF_BYTES) {
      this.fileError.set('This file is larger than 80 MB.');
      return;
    }
    this.file.set(chosen);
  }

  async upload(): Promise<void> {
    const target = this.uploadFor();
    const file = this.file();
    if (!target) return;
    if (!file) {
      this.fileError.set('Choose the PDF first.');
      return;
    }
    if (this.uploadForm.invalid) {
      this.uploadForm.markAllAsTouched();
      return;
    }
    const v = this.uploadForm.getRawValue();
    const body = new FormData();
    body.append('file', file, file.name);
    body.append('label', v.label.trim());
    if (v.volume) body.append('volume', String(v.volume));
    if (v.issue_number) body.append('issue_number', String(v.issue_number));
    if (v.year) body.append('year', String(v.year));
    if (v.month) body.append('month', String(v.month));
    body.append('watermark', String(v.watermark));
    this.uploading.set(true);
    this.uploadError.set('');
    this.uploadPercent.set(0);
    try {
      await new Promise<void>((resolve, reject) => {
        this.api.uploadEdition(target.id, body).subscribe({
          next: (event) => {
            if (event.type === HttpEventType.UploadProgress && event.total) this.uploadPercent.set(Math.round((100 * event.loaded) / event.total));
            else if (event.type === HttpEventType.Response) resolve();
          },
          error: reject
        });
      });
      this.uploading.set(false);
      this.uploadDialog().nativeElement.close();
      await this.refresh(true); // the new edition shows up as "processing"; the page then refreshes itself
    } catch (error) {
      this.uploadError.set(errorMessage(error));
    } finally {
      this.uploading.set(false);
    }
  }

  // ---- editions --------------------------------------------------------------------------------------------------------
  openEdition(edition: Edition): void {
    this.editingEdition.set(edition);
    this.editionError.set('');
    this.editionForm.reset({ label: edition.label, volume: edition.volume, issue_number: edition.issue_number, year: edition.year, month: edition.month });
    this.editionDialog().nativeElement.showModal();
  }

  closeEdition(): void {
    this.editionDialog().nativeElement.close();
  }

  async saveEdition(): Promise<void> {
    const current = this.editingEdition();
    if (!current) return;
    if (this.editionForm.invalid) {
      this.editionForm.markAllAsTouched();
      return;
    }
    this.editionSaving.set(true);
    this.editionError.set('');
    const v = this.editionForm.getRawValue();
    try {
      await this.api.updateEdition(current.id, { label: v.label.trim(), volume: v.volume || null, issue_number: v.issue_number || null, year: v.year || null, month: v.month || null });
      this.closeEdition();
      await this.refresh(true);
    } catch (error) {
      this.editionError.set(errorMessage(error));
    } finally {
      this.editionSaving.set(false);
    }
  }

  async setEditionStatus(edition: Edition, status: Status): Promise<void> {
    this.error.set('');
    try {
      await this.api.updateEdition(edition.id, { status });
      await this.refresh(true);
    } catch (error) {
      this.error.set(errorMessage(error));
    }
  }

  async retry(edition: Edition): Promise<void> {
    this.error.set('');
    try {
      await this.api.retryEdition(edition.id);
      await this.refresh(true);
    } catch (error) {
      this.error.set(errorMessage(error));
    }
  }

  async removeEdition(edition: Edition): Promise<void> {
    if (!confirm(`Delete “${edition.label}” and all its page pictures? This cannot be undone.`)) return;
    this.error.set('');
    try {
      await this.api.deleteEdition(edition.id);
      await this.refresh(true);
    } catch (error) {
      this.error.set(errorMessage(error));
    }
  }
}
