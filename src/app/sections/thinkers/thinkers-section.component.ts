import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, HostListener, Input, OnDestroy, signal, ViewChild } from '@angular/core';
import { THINKERS } from './data/thinkers.data';
import { createThinkerFanAnimation, type ThinkerFanAnimation } from './thinkers-animation';

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
  readonly selectedIndex = signal<number | null>(null);

  private animation?: ThinkerFanAnimation;
  private closing = false;
  private destroyed = false;

  ngAfterViewInit(): void {
    void createThinkerFanAnimation(this.sectionRoot.nativeElement).then(
      (animation) => {
        if (this.destroyed) {
          animation.destroy();
          return;
        }
        this.animation = animation;
        const selectedIndex = this.selectedIndex();
        if (selectedIndex !== null) animation.open(selectedIndex);
      },
      (error: unknown) => console.error('Unable to initialize the VCK thinker-card animation.', error)
    );
  }

  toggleThinker(index: number): void {
    if (this.closing) return;
    if (this.selectedIndex() === index) {
      this.closeThinker();
      return;
    }
    if (this.selectedIndex() !== null) return;

    this.selectedIndex.set(index);
    this.animation?.open(index);
    window.requestAnimationFrame(() => this.sectionRoot.nativeElement.querySelector<HTMLButtonElement>('.thinker-close')?.focus());
  }

  closeThinker(): void {
    const index = this.selectedIndex();
    if (index === null || this.closing) return;

    this.closing = true;
    const finishClose = (): void => {
      this.closing = false;
      this.selectedIndex.set(null);
      window.requestAnimationFrame(() => this.sectionRoot.nativeElement.querySelector<HTMLButtonElement>(`[data-thinker-index="${index}"]`)?.focus());
    };

    if (this.animation) {
      this.animation.close(index, finishClose);
    } else {
      finishClose();
    }
  }

  @HostListener('document:keydown.escape')
  closeOnEscape(): void {
    if (this.selectedIndex() !== null) this.closeThinker();
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.animation?.destroy();
  }
}
