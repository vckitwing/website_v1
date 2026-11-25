import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';
import { THINKERS } from './data/thinkers.data';
import { createThinkersAnimation } from './thinkers-animation';

@Component({
  selector: 'vck-thinkers-section',
  standalone: true,
  templateUrl: './thinkers-section.component.html',
  styleUrl: './thinkers-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ThinkersSectionComponent implements AfterViewInit, OnDestroy {
  @Input({ required: true }) language: 'en' | 'ta' = 'en';
  @ViewChild('sectionRoot', { static: true }) private sectionRoot!: ElementRef<HTMLElement>;

  readonly thinkers = THINKERS;

  private disposeAnimation?: () => void;
  private destroyed = false;

  ngAfterViewInit(): void {
    void createThinkersAnimation(this.sectionRoot.nativeElement).then(
      (dispose) => {
        if (this.destroyed) {
          dispose();
          return;
        }
        this.disposeAnimation = dispose;
      },
      (error: unknown) => console.error('Unable to initialize the VCK thinkers animation.', error)
    );
  }

  /** The name split into words, so each word can rise out of its own mask. */
  words(text: string): readonly string[] {
    return text.split(' ');
  }

  /** The other language's name, shown small beneath the main one. */
  otherName(thinker: { name: { en: string; ta: string } }): string {
    return this.language === 'ta' ? thinker.name.en : thinker.name.ta;
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.disposeAnimation?.();
  }
}
