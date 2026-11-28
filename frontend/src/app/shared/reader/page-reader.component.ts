import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  computed,
  inject,
  input,
  output,
  signal,
  viewChild
} from '@angular/core';
import { pageUrl, PublishedEdition } from '../content/publication.types';

interface Leaf {
  /** Leaf k carries page 2k+1 on its front and page 2k+2 on its back. */
  readonly index: number;
  readonly front: number;
  readonly back: number | null;
  readonly flipped: boolean;
  /** Distance from the current spread (-2 .. 2); the stylesheet stacks the leaves by it. */
  readonly offset: number;
}

interface SinglePage {
  readonly number: number;
  readonly state: 'before' | 'current' | 'after';
}

const UI = {
  en: {
    close: 'Close the reader',
    next: 'Next page',
    previous: 'Previous page',
    zoomIn: 'Zoom in',
    zoomOut: 'Zoom out',
    fullscreen: 'Full screen',
    exitFullscreen: 'Leave full screen',
    page: 'Page',
    pages: 'Pages',
    of: 'of',
    goTo: 'Go to page',
    slider: 'Page',
    loading: 'Loading page',
    note: 'Read online only. This book cannot be downloaded or copied.'
  },
  ta: {
    close: 'வாசிப்பை மூடு',
    next: 'அடுத்த பக்கம்',
    previous: 'முந்தைய பக்கம்',
    zoomIn: 'பெரிதாக்கு',
    zoomOut: 'சிறிதாக்கு',
    fullscreen: 'முழுத்திரை',
    exitFullscreen: 'முழுத்திரையிலிருந்து வெளியேறு',
    page: 'பக்கம்',
    pages: 'பக்கங்கள்',
    of: '/',
    goTo: 'பக்கத்திற்குச் செல்',
    slider: 'பக்கம்',
    loading: 'பக்கம் ஏற்றப்படுகிறது',
    note: 'இணையத்தில் மட்டுமே படிக்கலாம். பதிவிறக்கவோ நகலெடுக்கவோ முடியாது.'
  }
} as const;

/** Zoom steps (the CSS has one class per step). */
const MAX_ZOOM = 2;
const SWIPE_DISTANCE = 50;

/**
 * Full-screen reader for a book or magazine issue. It shows page PICTURES only, never the PDF and never text, and it
 * turns off right-click, dragging, selecting and printing. (Nothing can stop a screenshot; this removes the easy routes.)
 *
 * Wide screens: two pages side by side, turned like a real book (the cover alone at the start). Phones: one page at a
 * time. Only the pages next to the current one are in the document, so a 559-page book opens as fast as a short one.
 */
@Component({
  selector: 'vck-page-reader',
  standalone: true,
  templateUrl: './page-reader.component.html',
  styleUrl: './page-reader.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageReaderComponent implements OnInit, AfterViewInit, OnDestroy {
  readonly edition = input.required<PublishedEdition>();
  readonly title = input.required<string>();
  /** Shown after the title, already in the visitor's language (for example "Vol 9 · Issue 100 · February 2015"). */
  readonly subtitle = input<string>('');
  readonly language = input.required<'en' | 'ta'>();
  readonly closed = output<void>();

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly overlay = viewChild.required<ElementRef<HTMLElement>>('overlay');
  private readonly closeButton = viewChild.required<ElementRef<HTMLButtonElement>>('closeButton');

  readonly ui = computed(() => UI[this.language()]);
  readonly page = signal(1);
  readonly zoom = signal(0);
  readonly wide = signal(true);
  readonly fullscreen = signal(false);
  readonly canFullscreen = typeof document !== 'undefined' && !!document.documentElement.requestFullscreen;
  /** True for a moment after a long jump (slider, go-to-page): the book then changes pages without turning. */
  readonly instant = signal(false);
  private reducedMotion = false;

  readonly total = computed(() => this.edition().pages);
  readonly spread = computed(() => (this.wide() ? Math.floor(this.page() / 2) : 0));
  readonly maxSpread = computed(() => Math.floor(this.total() / 2));
  readonly atStart = computed(() => this.wide() && this.spread() === 0);
  /** An even page count ends with a left page and an empty right page. */
  readonly atEnd = computed(() => this.wide() && this.total() % 2 === 0 && this.spread() === this.maxSpread());
  readonly canPrevious = computed(() => this.page() > 1);
  readonly canNext = computed(() => (this.wide() ? this.spread() < this.maxSpread() : this.page() < this.total()));

  readonly leaves = computed<Leaf[]>(() => {
    if (!this.wide()) return [];
    const total = this.total();
    const current = this.spread();
    const lastLeaf = Math.ceil(total / 2) - 1;
    const leaves: Leaf[] = [];
    for (let k = Math.max(0, current - 2); k <= Math.min(lastLeaf, current + 2); k++) {
      leaves.push({ index: k, front: 2 * k + 1, back: 2 * k + 2 <= total ? 2 * k + 2 : null, flipped: k < current, offset: k - current });
    }
    return leaves;
  });

  readonly singlePages = computed<SinglePage[]>(() => {
    if (this.wide()) return [];
    const current = this.page();
    const pages: SinglePage[] = [];
    for (let n = Math.max(1, current - 1); n <= Math.min(this.total(), current + 2); n++) {
      pages.push({ number: n, state: n < current ? 'before' : n > current ? 'after' : 'current' });
    }
    return pages;
  });

  /** "Pages 2–3 of 48" on a spread, "Page 7 of 48" on a phone. */
  readonly label = computed(() => {
    const ui = this.ui();
    const total = this.total();
    if (!this.wide()) return `${ui.page} ${this.page()} ${ui.of} ${total}`;
    const left = this.spread() === 0 ? null : this.spread() * 2;
    const right = this.spread() * 2 + 1 <= total ? this.spread() * 2 + 1 : null;
    if (left && right) return `${ui.pages} ${left}–${right} ${ui.of} ${total}`;
    return `${ui.page} ${left ?? right} ${ui.of} ${total}`;
  });

  private mediaWide?: MediaQueryList;
  private readonly onMediaChange = (): void => this.wide.set(!!this.mediaWide?.matches);
  private touchStart: { x: number; y: number } | null = null;
  private instantTimer?: number;

  ngOnInit(): void {
    const edition = this.edition();
    // the one value the CSS cannot know: the shape of the pages (height / width)
    this.host.nativeElement.style.setProperty('--page-ratio', String(edition.height / edition.width));
    this.reducedMotion = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.mediaWide = typeof matchMedia === 'function' ? matchMedia('(min-width: 900px)') : undefined;
    this.mediaWide?.addEventListener('change', this.onMediaChange);
    this.wide.set(this.mediaWide ? this.mediaWide.matches : true);
    this.page.set(this.remembered());
    document.documentElement.classList.add('vck-reader-open');
  }

  ngAfterViewInit(): void {
    this.closeButton().nativeElement.focus();
  }

  ngOnDestroy(): void {
    this.mediaWide?.removeEventListener('change', this.onMediaChange);
    window.clearTimeout(this.instantTimer);
    document.documentElement.classList.remove('vck-reader-open');
    if (document.fullscreenElement) void document.exitFullscreen().catch(() => undefined);
  }

  url(page: number): string {
    return pageUrl(this.edition(), page);
  }

  // ---- turning pages ----------------------------------------------------------------------------------------------------
  next(): void {
    if (!this.canNext()) return;
    this.setPage(this.wide() ? this.pageOfSpread(this.spread() + 1) : this.page() + 1);
  }

  previous(): void {
    if (!this.canPrevious()) return;
    this.setPage(this.wide() ? this.pageOfSpread(this.spread() - 1) : this.page() - 1);
  }

  /** The page shown on the left of a spread (the cover for the first spread). */
  private pageOfSpread(spread: number): number {
    return spread <= 0 ? 1 : spread * 2;
  }

  setPage(target: number): void {
    const next = Math.min(this.total(), Math.max(1, Math.round(target)));
    if (next === this.page()) return;
    const turns = this.wide() ? Math.abs(Math.floor(next / 2) - this.spread()) : Math.abs(next - this.page());
    if (turns > 1 || this.reducedMotion) {
      // a long jump: change pages without turning every leaf in between
      this.instant.set(true);
      window.clearTimeout(this.instantTimer);
      this.instantTimer = window.setTimeout(() => this.instant.set(false), 120);
    }
    this.page.set(next);
    this.remember(next);
  }

  onSlider(event: Event): void {
    this.setPage(Number((event.target as HTMLInputElement).value));
  }

  onGoTo(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = Number(input.value);
    if (Number.isFinite(value) && value >= 1) this.setPage(value);
    input.value = String(this.page());
  }

  // ---- zoom, full screen, closing -------------------------------------------------------------------------------------------
  zoomIn(): void {
    this.zoom.update((z) => Math.min(MAX_ZOOM, z + 1));
  }

  zoomOut(): void {
    this.zoom.update((z) => Math.max(0, z - 1));
  }

  toggleFullscreen(): void {
    if (document.fullscreenElement) void document.exitFullscreen().catch(() => undefined);
    else void this.overlay().nativeElement.requestFullscreen().catch(() => undefined);
  }

  @HostListener('document:fullscreenchange')
  onFullscreenChange(): void {
    this.fullscreen.set(!!document.fullscreenElement);
  }

  close(): void {
    this.closed.emit();
  }

  // ---- input ---------------------------------------------------------------------------------------------------------------
  @HostListener('document:keydown', ['$event'])
  onKey(event: KeyboardEvent): void {
    const target = event.target as HTMLElement | null;
    const typing = target?.tagName === 'INPUT' && (target as HTMLInputElement).type === 'number';
    switch (event.key) {
      case 'Escape':
        if (!document.fullscreenElement) this.close();
        break;
      case 'ArrowRight':
      case 'PageDown':
        if (typing) return;
        event.preventDefault();
        this.next();
        break;
      case 'ArrowLeft':
      case 'PageUp':
        if (typing) return;
        event.preventDefault();
        this.previous();
        break;
      case 'Home':
        if (typing) return;
        event.preventDefault();
        this.setPage(1);
        break;
      case 'End':
        if (typing) return;
        event.preventDefault();
        this.setPage(this.total());
        break;
      case '+':
      case '=':
        if (!typing) this.zoomIn();
        break;
      case '-':
        if (!typing) this.zoomOut();
        break;
      case 'Tab':
        this.keepFocusInside(event);
        break;
    }
  }

  /** A modal: Tab goes round the reader's own controls and never reaches the page behind. */
  private keepFocusInside(event: KeyboardEvent): void {
    const focusable = Array.from(this.overlay().nativeElement.querySelectorAll<HTMLElement>('button:not(:disabled), input:not(:disabled)'));
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement;
    if (event.shiftKey && active === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    } else if (!this.overlay().nativeElement.contains(active)) {
      event.preventDefault();
      first.focus();
    }
  }

  onPointerDown(event: PointerEvent): void {
    this.touchStart = event.pointerType === 'mouse' ? null : { x: event.clientX, y: event.clientY };
  }

  /** A quick sideways swipe turns the page (only when not zoomed in, where the swipe scrolls instead). */
  onPointerUp(event: PointerEvent): void {
    const start = this.touchStart;
    this.touchStart = null;
    if (!start || this.zoom() > 0) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.abs(dx) < SWIPE_DISTANCE || Math.abs(dx) < Math.abs(dy) * 1.5) return;
    if (dx < 0) this.next();
    else this.previous();
  }

  /** No context menu on the pictures (no "Save image as…"). */
  @HostListener('contextmenu', ['$event'])
  onContextMenu(event: Event): void {
    event.preventDefault();
  }

  // ---- remembering where the reader stopped --------------------------------------------------------------------------------------
  private storageKey(): string {
    return `vck-reader:${this.edition().id}`;
  }

  private remembered(): number {
    try {
      const saved = Number(localStorage.getItem(this.storageKey()));
      if (Number.isInteger(saved) && saved >= 1 && saved <= this.total()) return saved;
    } catch {
      /* storage can be unavailable */
    }
    return 1;
  }

  private remember(page: number): void {
    try {
      localStorage.setItem(this.storageKey(), String(page));
    } catch {
      /* ignore */
    }
  }
}
