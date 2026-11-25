import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, inject, Input, OnDestroy, signal, ViewChild } from '@angular/core';
import { createContactAnimation } from '../../pages/contact/contact-animation';
import { SiteContentService } from '../content/site-content.service';
import { PublishedEdition, PublishedPublication } from '../content/publication.types';
import { PageReaderComponent } from '../reader/page-reader.component';
import type { FloatingBook3D } from './book-3d';
import { BOOK_COPY, BOOK_SLUG } from './featured-book.data';

/**
 * The book (Amaipai Thiralvom) as a floating 3D object. Clicking it (or the Read button) opens the cover and then the
 * page reader. Without WebGL it is a flat cover that opens the same reader. Shown on Publications > Amaipai Thiralvom.
 */
@Component({
  selector: 'vck-featured-book',
  standalone: true,
  imports: [PageReaderComponent],
  templateUrl: './featured-book.component.html',
  // reuses the contact page's heading / button styles (the `ct-*` classes), then adds its own
  styleUrls: ['../../pages/contact/contact-page.component.scss', './featured-book.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeaturedBookComponent implements AfterViewInit, OnDestroy {
  @Input({ required: true }) language: 'en' | 'ta' = 'en';
  @ViewChild('pageRoot') private pageRoot?: ElementRef<HTMLElement>;
  @ViewChild('bookCanvas') private bookCanvas?: ElementRef<HTMLCanvasElement>;
  @ViewChild('readButton') private readButton?: ElementRef<HTMLButtonElement>;

  readonly copy = BOOK_COPY;
  private readonly content = inject(SiteContentService);

  readonly publication: PublishedPublication | null =
    this.content.publications.find((p) => p.slug === BOOK_SLUG) ?? this.content.publications.find((p) => p.kind === 'book') ?? null;
  /** The newest published edition of the book. */
  readonly edition: PublishedEdition | null = this.publication?.editions[0] ?? null;

  /** `loading` and `flat` show the plain cover; `3d` shows the floating book. */
  readonly mode = signal<'loading' | '3d' | 'flat'>('loading');
  readonly reading = signal(false);
  private busy = false;
  private book3d: FloatingBook3D | null = null;
  private opener: HTMLElement | null = null;
  private nearScreen?: IntersectionObserver;
  private disposeAnimation?: () => void;
  private destroyed = false;
  private readonly reduceMotion = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

  ngAfterViewInit(): void {
    const root = this.pageRoot?.nativeElement;
    if (!root) return;
    void createContactAnimation(root).then(
      (dispose) => {
        if (this.destroyed) dispose();
        else this.disposeAnimation = dispose;
      },
      (error: unknown) => console.error('Unable to initialize the book page animation.', error)
    );
    const canvas = this.bookCanvas?.nativeElement;
    if (!canvas) return;
    // The 3D book (and its picture) is only built when the visitor is about to reach it.
    this.nearScreen = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        this.nearScreen?.disconnect();
        void this.startBook(canvas);
      },
      { rootMargin: '600px 0px' }
    );
    this.nearScreen.observe(canvas);
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.nearScreen?.disconnect();
    this.disposeAnimation?.();
    this.book3d?.destroy();
  }

  private async startBook(canvas: HTMLCanvasElement): Promise<void> {
    const edition = this.edition;
    const publication = this.publication;
    if (!edition || !publication) return;
    try {
      const { FloatingBook3D } = await import('./book-3d');
      if (this.destroyed) return;
      const device = navigator as Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number };
      const lite = !!device.connection?.saveData || (device.deviceMemory !== undefined && device.deviceMemory <= 2);
      const book = await FloatingBook3D.create(canvas, {
        coverUrl: edition.cover,
        pages: edition.pages,
        title: publication.title.ta,
        reduceMotion: this.reduceMotion,
        lite
      });
      if (this.destroyed) {
        book.destroy();
        return;
      }
      book.onActivate = () => void this.openBook(null);
      this.book3d = book;
      this.mode.set('3d');
    } catch (error) {
      console.warn('The 3D book is not available; showing the flat cover.', error);
      if (!this.destroyed) this.mode.set('flat');
    }
  }

  /** The cover swings open (3D) and then the reader appears. */
  async openBook(event: Event | null): Promise<void> {
    if (this.busy || this.reading()) return;
    this.opener = (event?.currentTarget as HTMLElement | null) ?? this.readButton?.nativeElement ?? null;
    this.busy = true;
    try {
      if (this.book3d && this.mode() === '3d') await this.book3d.open();
    } finally {
      this.busy = false;
    }
    if (this.destroyed) return;
    this.reading.set(true);
    this.book3d?.setPaused(true); // the reader covers the screen: no need to keep drawing
  }

  async close(): Promise<void> {
    this.reading.set(false);
    window.setTimeout(() => this.opener?.focus({ preventScroll: true }), 0);
    if (this.book3d) {
      this.book3d.setPaused(false);
      await this.book3d.close();
    }
  }
}
