import { AfterViewInit, ChangeDetectionStrategy, Component, computed, ElementRef, inject, Input, OnDestroy, signal, ViewChild } from '@angular/core';
import { SiteContentService } from '../../shared/content/site-content.service';
import { PublishedEdition, PublishedPublication } from '../../shared/content/publication.types';
import { PageReaderComponent } from '../../shared/reader/page-reader.component';
import { createContactAnimation } from '../contact/contact-animation';
import { TAMIL_LAND_COPY, TAMIL_LAND_SLUG } from './data/tamil-land.data';

/** Earlier issues shown per page. */
const PAGE_SIZE = 8;

/**
 * Publications > Our Tamil Land: the monthly magazine "Namathu Thamizhman". The newest issue is shown large at the top;
 * below it every issue (the latest included) is listed, newest first, in pages of eight, searchable by month and year.
 */
@Component({
  selector: 'vck-tamil-land-page',
  standalone: true,
  imports: [PageReaderComponent],
  templateUrl: './tamil-land-page.component.html',
  // reuses the contact page's page / heading / button styles (the `ct-*` classes), then adds its own
  styleUrls: ['../contact/contact-page.component.scss', './tamil-land-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TamilLandPageComponent implements AfterViewInit, OnDestroy {
  @Input({ required: true }) language: 'en' | 'ta' = 'en';
  @ViewChild('pageRoot', { static: true }) private pageRoot!: ElementRef<HTMLElement>;

  readonly copy = TAMIL_LAND_COPY;
  private readonly content = inject(SiteContentService);

  readonly publication: PublishedPublication | null =
    this.content.publications.find((p) => p.slug === TAMIL_LAND_SLUG) ?? this.content.publications.find((p) => p.kind === 'monthly') ?? null;
  /** The newest published issue (editions arrive newest first). */
  readonly issue: PublishedEdition | null = this.publication?.editions[0] ?? null;

  /** Every published issue, newest first (the first one is also the "latest" shown large at the top). */
  readonly issues: readonly PublishedEdition[] = this.publication?.editions ?? [];
  readonly years: readonly number[] = [...new Set(this.issues.map((e) => e.year).filter((y): y is number => y !== null))].sort((a, b) => b - a);
  readonly pageSize = PAGE_SIZE;

  readonly month = signal<number | null>(null);
  readonly year = signal<number | null>(null);
  readonly pageNumber = signal(1);

  readonly filtered = computed(() => this.issues.filter((e) => (this.month() === null || e.month === this.month()) && (this.year() === null || e.year === this.year())));
  readonly pageCount = computed(() => Math.max(1, Math.ceil(this.filtered().length / PAGE_SIZE)));
  readonly visible = computed(() => this.filtered().slice((this.pageNumber() - 1) * PAGE_SIZE, this.pageNumber() * PAGE_SIZE));
  /** Page buttons: the first, the last and the neighbours of the current page, with gaps shown as "…". */
  readonly pageButtons = computed<(number | null)[]>(() => {
    const total = this.pageCount();
    const current = this.pageNumber();
    const wanted = new Set([1, total, current - 1, current, current + 1].filter((n) => n >= 1 && n <= total));
    const sorted = [...wanted].sort((a, b) => a - b);
    const buttons: (number | null)[] = [];
    sorted.forEach((n, i) => {
      if (i > 0 && n - sorted[i - 1] > 1) buttons.push(null);
      buttons.push(n);
    });
    return buttons;
  });

  /** The issue open in the reader (the latest, or one from the archive). */
  readonly reading = signal<PublishedEdition | null>(null);
  private opener: HTMLElement | null = null;
  private disposeAnimation?: () => void;
  private destroyed = false;

  ngAfterViewInit(): void {
    void createContactAnimation(this.pageRoot.nativeElement).then(
      (dispose) => {
        if (this.destroyed) dispose();
        else this.disposeAnimation = dispose;
      },
      (error: unknown) => console.error('Unable to initialize the Our Tamil Land animation.', error)
    );
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.disposeAnimation?.();
  }

  /** "Vol 9 · Issue 100 · February 2015", in the visitor's language. */
  subtitle(issue: PublishedEdition): string {
    const lang = this.language;
    const parts: string[] = [];
    if (issue.volume) parts.push(`${this.copy.volume[lang]} ${issue.volume}`);
    if (issue.issue) parts.push(`${this.copy.issue[lang]} ${issue.issue}`);
    if (!issue.volume && !issue.issue) parts.push(issue.label);
    if (issue.month && issue.year) parts.push(`${this.copy.months[lang][issue.month - 1]} ${issue.year}`);
    else if (issue.year) parts.push(String(issue.year));
    return parts.join(' · ');
  }

  /** The same with the page count: "Vol 9 · Issue 100 · February 2015 · 48 pages". */
  meta(issue: PublishedEdition): string {
    return `${this.subtitle(issue)} · ${issue.pages} ${this.copy.pages[this.language]}`;
  }

  open(event: Event, edition: PublishedEdition): void {
    this.opener = event.currentTarget as HTMLElement;
    this.reading.set(edition);
  }

  close(): void {
    this.reading.set(null);
    // hand the keyboard back to the button that opened the reader
    window.setTimeout(() => this.opener?.focus(), 0);
  }

  // ---- all issues: search and pages ---------------------------------------------------------------------------------------
  onMonth(event: Event): void {
    const value = Number((event.target as HTMLSelectElement).value);
    this.month.set(value >= 1 && value <= 12 ? value : null);
    this.pageNumber.set(1);
  }

  onYear(event: Event): void {
    const value = Number((event.target as HTMLSelectElement).value);
    this.year.set(value > 0 ? value : null);
    this.pageNumber.set(1);
  }

  reset(): void {
    this.month.set(null);
    this.year.set(null);
    this.pageNumber.set(1);
  }

  goTo(page: number): void {
    this.pageNumber.set(Math.min(this.pageCount(), Math.max(1, page)));
  }

  /** "February 2015", or the issue's own label when it has no date. */
  monthYear(edition: PublishedEdition): string {
    if (edition.month && edition.year) return `${this.copy.months[this.language][edition.month - 1]} ${edition.year}`;
    return edition.year ? String(edition.year) : edition.label;
  }

  /** "Vol 9 · Issue 99" (what the date line leaves out). */
  numbers(edition: PublishedEdition): string {
    const parts: string[] = [];
    if (edition.volume) parts.push(`${this.copy.volume[this.language]} ${edition.volume}`);
    if (edition.issue) parts.push(`${this.copy.issue[this.language]} ${edition.issue}`);
    return parts.join(' · ');
  }

  /** The text for what is currently searched, e.g. "February 2014". */
  searchText(): string {
    const parts: string[] = [];
    if (this.month() !== null) parts.push(this.copy.months[this.language][this.month()! - 1]);
    if (this.year() !== null) parts.push(String(this.year()));
    return parts.join(' ');
  }

  /** "Showing 1–8 of 19 issues". */
  summary(): string {
    const total = this.filtered().length;
    if (!total) return '';
    if (total === 1) return this.language === 'ta' ? '1 இதழ்' : '1 issue';
    const from = (this.pageNumber() - 1) * PAGE_SIZE + 1;
    const to = Math.min(total, this.pageNumber() * PAGE_SIZE);
    return this.language === 'ta' ? `${total} இதழ்களில் ${from}–${to} காட்டப்படுகிறது` : `Showing ${from}–${to} of ${total} issues`;
  }
}
