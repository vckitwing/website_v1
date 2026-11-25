import { NgTemplateOutlet } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';
import { SOCIAL_LINKS } from '../social/data/social-links';
import { FOOTER_CONTENT } from './data/footer.data';
import { createFooterAnimation } from './footer-animation';

@Component({
  selector: 'vck-footer-section',
  standalone: true,
  imports: [NgTemplateOutlet],
  templateUrl: './footer-section.component.html',
  styleUrl: './footer-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterSectionComponent implements AfterViewInit, OnDestroy {
  @Input({ required: true }) language: 'en' | 'ta' = 'en';
  @ViewChild('sectionRoot', { static: true }) private sectionRoot!: ElementRef<HTMLElement>;

  readonly content = FOOTER_CONTENT;
  readonly links = SOCIAL_LINKS;
  readonly year = new Date().getFullYear();

  private disposeAnimation?: () => void;
  private destroyed = false;

  ngAfterViewInit(): void {
    void createFooterAnimation(this.sectionRoot.nativeElement).then(
      (dispose) => {
        if (this.destroyed) {
          dispose();
          return;
        }
        this.disposeAnimation = dispose;
      },
      (error: unknown) => console.error('Unable to initialize the VCK footer animation.', error)
    );
  }

  label(name: { en: string; ta: string }): string {
    return this.language === 'ta'
      ? `${name.ta} தளத்தில் விசிகவைப் பின்தொடருங்கள் (புதிய தாவலில் திறக்கும்)`
      : `Follow VCK on ${name.en} (opens in a new tab)`;
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.disposeAnimation?.();
  }
}
