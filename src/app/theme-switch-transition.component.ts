import { Component, ElementRef, ViewChild } from '@angular/core';
import { gsap } from 'gsap';

type Theme = 'dark' | 'light';

@Component({
  selector: 'vck-theme-switch-transition',
  standalone: true,
  template: `<div #veil class="theme-reveal" aria-hidden="true"><div #surface class="theme-reveal-surface"></div><div #edge class="theme-reveal-edge"></div></div>`,
  styleUrl: './theme-switch-transition.component.css'
})
export class ThemeSwitchTransitionComponent {
  @ViewChild('veil', { static: true }) private veilRef!: ElementRef<HTMLDivElement>;
  @ViewChild('surface', { static: true }) private surfaceRef!: ElementRef<HTMLDivElement>;
  @ViewChild('edge', { static: true }) private edgeRef!: ElementRef<HTMLDivElement>;
  isPlaying = false;

  play(toggle: HTMLElement, previousTheme: Theme): void {
    if (this.isPlaying) return;
    this.isPlaying = true;

    const veil = this.veilRef.nativeElement;
    const surface = this.surfaceRef.nativeElement;
    const edge = this.edgeRef.nativeElement;
    const rect = toggle.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const color = previousTheme === 'dark' ? '#07111f' : '#f2f6fc';
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const progress = { value: 0 };
    const supportsMask = CSS.supports('mask-image', 'radial-gradient(circle, transparent, #000)') ||
      CSS.supports('-webkit-mask-image', 'radial-gradient(circle, transparent, #000)');

    surface.style.backgroundColor = color;
    veil.classList.add('is-active');
    this.applyMask(surface, x, y, 0);
    gsap.set(edge, { x, y, xPercent: -50, yPercent: -50, scale: .15, autoAlpha: reducedMotion ? 0 : .8 });

    const complete = () => {
      veil.classList.remove('is-active');
      gsap.set([surface, edge], { clearProps: 'all' });
      this.isPlaying = false;
    };

    if (reducedMotion || !supportsMask) {
      surface.style.maskImage = 'none';
      surface.style.webkitMaskImage = 'none';
      gsap.set(surface, { opacity: .5 });
      gsap.to(surface, { opacity: 0, duration: reducedMotion ? .22 : .55, ease: 'power1.out', onComplete: complete });
      return;
    }

    const farthestCorner = this.farthestCorner(x, y);

    gsap.to(progress, {
      value: 1,
      duration: gsap.utils.clamp(.68, 1.05, farthestCorner / 1000),
      ease: 'power2.inOut',
      onUpdate: () => {
        const radius = (this.farthestCorner(x, y) + 28) * progress.value;
        this.applyMask(surface, x, y, radius);
        gsap.set(edge, {
          scale: Math.max(.15, radius / 54),
          autoAlpha: Math.max(0, .8 * (1 - progress.value))
        });
      },
      onComplete: complete
    });
  }

  private farthestCorner(x: number, y: number): number {
    const width = window.innerWidth;
    const height = window.innerHeight;
    return Math.max(
      Math.hypot(x, y), Math.hypot(width - x, y),
      Math.hypot(x, height - y), Math.hypot(width - x, height - y)
    );
  }

  private applyMask(surface: HTMLElement, x: number, y: number, radius: number): void {
    const softEdge = 18;
    const transparentUntil = Math.max(0, radius - softEdge);
    const opaqueAfter = radius + softEdge;
    const mask = `radial-gradient(circle at ${x}px ${y}px, transparent 0, transparent ${transparentUntil}px, rgba(0,0,0,.48) ${radius}px, #000 ${opaqueAfter}px)`;
    surface.style.maskImage = mask;
    surface.style.webkitMaskImage = mask;
  }
}
