import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, OnDestroy, ViewChild, signal } from '@angular/core';
import { IDEOLOGY_CONTENT_EN } from './data/ideology-content.en';
import { IDEOLOGY_CONTENT_TA } from './data/ideology-content.ta';
import type { IdeologyKey, IdeologyPrinciple } from './data/ideology.types';
import { createIdeologyAnimation } from './ideology-animation';

type IdeologyPoint = {
  key: IdeologyKey;
  tip: { x: number; y: number };
  path: string;
  connectionPath: string;
};

@Component({
  selector: 'vck-ideology-section',
  standalone: true,
  templateUrl: './ideology-section.component.html',
  styleUrl: './ideology-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IdeologySectionComponent implements AfterViewInit, OnDestroy {
  @Input({ required: true }) language: 'en' | 'ta' = 'en';
  @ViewChild('sectionRoot', { static: true }) private sectionRoot!: ElementRef<HTMLElement>;

  readonly activeIndex = signal(0);
  readonly points: readonly IdeologyPoint[] = [
    { key: 'equality', tip: { x: 50, y: 4 }, path: 'M50 50 L38.5 36 L50 4 L61.5 36 Z', connectionPath: 'M50 50 L50 4' },
    { key: 'social-justice', tip: { x: 96, y: 37 }, path: 'M50 50 L61.5 36 L96 37 L68 58 Z', connectionPath: 'M50 50 L96 37' },
    { key: 'self-respect', tip: { x: 78, y: 92 }, path: 'M50 50 L68 58 L78 92 L50 73 Z', connectionPath: 'M50 50 L78 92' },
    { key: 'democracy', tip: { x: 22, y: 92 }, path: 'M50 50 L50 73 L22 92 L32 58 Z', connectionPath: 'M50 50 L22 92' },
    { key: 'liberation', tip: { x: 4, y: 37 }, path: 'M50 50 L32 58 L4 37 L38.5 36 Z', connectionPath: 'M50 50 L4 37' }
  ];

  private disposeAnimation?: () => void;
  private destroyed = false;

  get principles(): readonly IdeologyPrinciple[] {
    return this.language === 'ta' ? IDEOLOGY_CONTENT_TA : IDEOLOGY_CONTENT_EN;
  }

  ngAfterViewInit(): void {
    void createIdeologyAnimation(this.sectionRoot.nativeElement, (index) => {
      if (this.activeIndex() !== index) this.activeIndex.set(index);
    }).then(
      (dispose) => {
        if (this.destroyed) {
          dispose();
          return;
        }
        this.disposeAnimation = dispose;
      },
      (error: unknown) => console.error('Unable to initialize the VCK ideology animation.', error)
    );
  }

  selectPrinciple(index: number): void {
    const boundedIndex = Math.max(0, Math.min(this.points.length - 1, index));
    const root = this.sectionRoot.nativeElement;
    const sectionTop = root.getBoundingClientRect().top + window.scrollY;
    const scrollRange = Math.max(0, root.offsetHeight - window.innerHeight);
    const progress = (boundedIndex + 0.5) / this.points.length;
    const behavior: ScrollBehavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';

    window.scrollTo({ top: sectionTop + scrollRange * progress, behavior });
  }

  onPointKeydown(event: KeyboardEvent, index: number): void {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    this.selectPrinciple(index);
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.disposeAnimation?.();
  }
}
