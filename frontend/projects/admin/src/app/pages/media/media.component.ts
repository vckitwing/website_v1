import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService, errorMessage } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { MediaAsset } from '../../core/models';

const MAX_BYTES = 10 * 1024 * 1024;
const TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const NOT_BLANK = Validators.pattern(/\S/);

@Component({
  selector: 'adm-media',
  imports: [ReactiveFormsModule, DatePipe],
  templateUrl: './media.component.html',
  styleUrl: './media.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MediaComponent {
  private readonly api = inject(ApiService);
  readonly auth = inject(AuthService);
  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');
  private readonly fileInput = viewChild.required<ElementRef<HTMLInputElement>>('fileInput');

  readonly items = signal<MediaAsset[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');
  readonly uploading = signal(false);
  readonly uploadError = signal('');
  readonly uploaded = signal('');
  readonly file = signal<File | null>(null);
  readonly editing = signal<MediaAsset | null>(null);
  readonly formError = signal('');
  readonly saving = signal(false);

  readonly uploadForm = inject(FormBuilder).nonNullable.group({
    alt_en: ['', [Validators.required, NOT_BLANK, Validators.maxLength(300)]],
    alt_ta: ['', [Validators.required, NOT_BLANK, Validators.maxLength(300)]],
    caption_en: [''],
    caption_ta: ['']
  });
  readonly editForm = inject(FormBuilder).nonNullable.group({
    alt_en: ['', [Validators.required, NOT_BLANK, Validators.maxLength(300)]],
    alt_ta: ['', [Validators.required, NOT_BLANK, Validators.maxLength(300)]],
    caption_en: [''],
    caption_ta: ['']
  });

  constructor() {
    void this.load();
  }

  async load(): Promise<void> {
    this.loading.set(true);
    this.error.set('');
    try {
      this.items.set(await this.api.media());
    } catch (error) {
      this.error.set(errorMessage(error));
    } finally {
      this.loading.set(false);
    }
  }

  onFile(event: Event): void {
    const chosen = (event.target as HTMLInputElement).files?.[0] ?? null;
    this.uploaded.set('');
    this.uploadError.set('');
    if (chosen && !TYPES.includes(chosen.type)) {
      this.uploadError.set('Choose a JPEG, PNG or WebP picture.');
      this.file.set(null);
      return;
    }
    if (chosen && chosen.size > MAX_BYTES) {
      this.uploadError.set('This file is larger than 10 MB. Choose a smaller picture.');
      this.file.set(null);
      return;
    }
    this.file.set(chosen);
  }

  async upload(): Promise<void> {
    const file = this.file();
    if (!file) {
      this.uploadError.set('Choose a picture first.');
      return;
    }
    if (this.uploadForm.invalid) {
      this.uploadForm.markAllAsTouched();
      return;
    }
    this.uploading.set(true);
    this.uploadError.set('');
    this.uploaded.set('');
    const value = this.uploadForm.getRawValue();
    const body = new FormData();
    body.append('file', file, file.name);
    body.append('alt_en', value.alt_en.trim());
    body.append('alt_ta', value.alt_ta.trim());
    if (value.caption_en.trim()) body.append('caption_en', value.caption_en.trim());
    if (value.caption_ta.trim()) body.append('caption_ta', value.caption_ta.trim());
    try {
      const saved = await this.api.uploadMedia(body);
      this.items.update((list) => [saved, ...list]);
      this.uploadForm.reset();
      this.file.set(null);
      this.fileInput().nativeElement.value = '';
      this.uploaded.set(`Uploaded “${saved.filename}” (${saved.variants.length} sizes).`);
    } catch (error) {
      this.uploadError.set(errorMessage(error));
    } finally {
      this.uploading.set(false);
    }
  }

  openEdit(item: MediaAsset): void {
    this.editing.set(item);
    this.formError.set('');
    this.editForm.reset({ alt_en: item.alt_en, alt_ta: item.alt_ta, caption_en: item.caption_en ?? '', caption_ta: item.caption_ta ?? '' });
    this.dialog().nativeElement.showModal();
  }

  closeEdit(): void {
    this.dialog().nativeElement.close();
  }

  async saveEdit(): Promise<void> {
    const current = this.editing();
    if (!current) return;
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }
    this.saving.set(true);
    this.formError.set('');
    const v = this.editForm.getRawValue();
    try {
      const saved = await this.api.updateMedia(current.id, {
        alt_en: v.alt_en.trim(),
        alt_ta: v.alt_ta.trim(),
        caption_en: v.caption_en.trim() || null,
        caption_ta: v.caption_ta.trim() || null
      });
      this.items.update((list) => list.map((m) => (m.id === saved.id ? saved : m)));
      this.closeEdit();
    } catch (error) {
      this.formError.set(errorMessage(error));
    } finally {
      this.saving.set(false);
    }
  }

  async remove(item: MediaAsset): Promise<void> {
    if (!confirm(`Delete “${item.filename}”? Anything that uses this picture will lose it. This cannot be undone.`)) return;
    this.error.set('');
    try {
      await this.api.deleteMedia(item.id);
      this.items.update((list) => list.filter((m) => m.id !== item.id));
    } catch (error) {
      this.error.set(errorMessage(error));
    }
  }

  /** The copy shown in the grid: the smallest one that is at least 400px wide (or the only one). */
  thumb(item: MediaAsset): string {
    return item.variants[0].url;
  }

  largest(item: MediaAsset): string {
    return item.variants[item.variants.length - 1].url;
  }
}
