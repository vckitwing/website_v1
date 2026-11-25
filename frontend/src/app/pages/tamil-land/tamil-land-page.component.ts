import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, inject, Input, OnDestroy, signal, ViewChild } from '@angular/core';
import { SiteContentService } from '../../shared/content/site-content.service';
import { PublishedEdition, PublishedPublication } from '../../shared/content/publication.types';
import { PageReaderComponent } from '../../shared/reader/page-reader.component';
import { createContactAnimation } from '../contact/contact-animation';
import { TAMIL_LAND_COPY, TAMIL_LAND_SLUG } from './data/tamil-land.data';

/**
 * Publications > Our Tamil Land: the monthly magazine "Namathu Thamizhman". Only the LATEST issue is shown (no archive,
 * by the owner's choice); older published issues stay in the admin but are not listed here.
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

  readonly reading = signal(false);
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

  open(event: Event): void {
    this.opener = event.currentTarget as HTMLElement;
    this.reading.set(true);
  }

  close(): void {
    this.reading.set(false);
    // hand the keyboard back to the button that opened the reader
    window.setTimeout(() => this.opener?.focus(), 0);
  }
}
