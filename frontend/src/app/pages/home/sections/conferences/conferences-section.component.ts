import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, OnDestroy, signal, ViewChild } from '@angular/core';
import type { Conference } from './data/conference.types';
import { CONFERENCES } from './data/conferences';
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

  readonly conferences = CONFERENCES;
  /** The conferences dealt into three rows, round-robin, so every row runs through the years in order. */
  readonly rows: readonly (readonly { conference: Conference; tone: number }[])[] = Array.from({ length: ROWS }, (_, row) =>
    CONFERENCES.flatMap((conference, index) => (index % ROWS === row ? [{ conference, tone: index % 3 }] : []))
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
