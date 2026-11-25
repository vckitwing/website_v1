import { NgTemplateOutlet } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';
import { SOCIAL_LINKS } from './data/social-links';
import { createSocialAnimation } from './social-animation';

@Component({
  selector: 'vck-social-section',
  standalone: true,
  imports: [NgTemplateOutlet],
  templateUrl: './social-section.component.html',
  styleUrl: './social-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SocialSectionComponent implements AfterViewInit, OnDestroy {
  @Input({ required: true }) language: 'en' | 'ta' = 'en';
  @ViewChild('sectionRoot', { static: true }) private sectionRoot!: ElementRef<HTMLElement>;

  readonly links = SOCIAL_LINKS;

  private disposeAnimation?: () => void;
  private destroyed = false;

  ngAfterViewInit(): void {
    void createSocialAnimation(this.sectionRoot.nativeElement).then(
      (dispose) => {
        if (this.destroyed) {
          dispose();
          return;
        }
        this.disposeAnimation = dispose;
      },
      (error: unknown) => console.error('Unable to initialize the VCK social links animation.', error)
    );
  }

  /** Spoken name of a link: what it is, and that it opens elsewhere. */
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
