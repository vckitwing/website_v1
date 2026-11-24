import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, OnDestroy, inject, signal, ViewChild } from '@angular/core';
import { SiteContentService } from '../../../../shared/content/site-content.service';
import type { Conference } from './data/conference.types';
import { createConferencesAnimation, type ConferencesAnimation } from './conferences-animation';

const ROWS = 3;

@Component({
  selector: 'vck-conferences-section',
  standalone: true,
  templateUrl: './conferences-section.component.html',
  styleUrl: './conferences-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConferencesSectionComponent implements AfterViewInit, OnDestroy {
  @Input({ required: true }) language: 'en' | 'ta' = 'en';
  @ViewChild('sectionRoot', { static: true }) private sectionRoot!: ElementRef<HTMLElement>;

  readonly conferences = inject(SiteContentService).conferences;
  /** The span shown in the heading, taken from the data so it stays right when conferences are added. */
  readonly firstYear = Math.min(...this.conferences.map((conference) => conference.year));
  readonly lastYear = Math.max(...this.conferences.map((conference) => conference.year));
  /** The conferences dealt into three rows, round-robin, so every row runs through the years in order. */
  readonly rows: readonly (readonly { conference: Conference; tone: number }[])[] = Array.from({ length: ROWS }, (_, row) =>
    this.conferences.flatMap((conference, index) => (index % ROWS === row ? [{ conference, tone: index % 3 }] : []))
  );
  /** Each row's tiles are repeated so the row can drift endlessly. */
  readonly copies = [0, 1, 2] as const;
  /** The user's own pause switch (moving content must be pausable). */
  readonly paused = signal(false);

  private animation?: ConferencesAnimation;
  private destroyed = false;

  ngAfterViewInit(): void {
    void createConferencesAnimation(this.sectionRoot.nativeElement).then(
      (animation) => {
        if (this.destroyed) {
          animation.dispose();
          return;
        }
        this.animation = animation;
        animation.setPaused(this.paused());
      },
      (error: unknown) => console.error('Unable to initialize the VCK conferences animation.', error)
    );
  }

  toggleMotion(): void {
    this.paused.update((value) => !value);
    this.animation?.setPaused(this.paused());
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.animation?.dispose();
  }
}
