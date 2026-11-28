import { AfterViewInit, ChangeDetectionStrategy, Component, computed, ElementRef, HostListener, input, OnDestroy, output, viewChild } from '@angular/core';
import { gsap } from 'gsap';
import { TEAM_FLOW_COPY, TEAM_FLOWS } from './data/org-team-hierarchy.data';
import type { OrgTeam } from './data/org-teams.data';

/** What was tapped to open a team's hierarchy: the overlay grows out of it and shrinks back into it. */
export interface OpenTeam {
  readonly team: OrgTeam;
  readonly from: HTMLElement;
}

const HISTORY_MARK = 'vckTeamOverlay';

/**
 * A team's hierarchy in a modal window over the page (full screen on phones). It closes with its button, a tap outside,
 * Escape or the browser's / phone's Back button.
 */
@Component({
  selector: 'vck-org-team-overlay',
  standalone: true,
  templateUrl: './org-team-overlay.component.html',
  styleUrl: './org-team-overlay.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrgTeamOverlayComponent implements AfterViewInit, OnDestroy {
  readonly language = input.required<'en' | 'ta'>();
  readonly opened = input.required<OpenTeam>();
  readonly closed = output<void>();

  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');
  private readonly panel = viewChild.required<ElementRef<HTMLElement>>('panel');

  readonly copy = TEAM_FLOW_COPY;
  readonly steps = computed(() => {
    const flow = this.opened().team.flow;
    return flow ? TEAM_FLOWS[flow] : [];
  });

  private tween?: gsap.core.Tween;
  private leaving = false;

  ngAfterViewInit(): void {
    this.dialog().nativeElement.showModal();
    document.documentElement.classList.add('vck-overlay-open');
    // an entry of its own, so that Back closes the window instead of leaving the page
    history.pushState({ ...history.state, [HISTORY_MARK]: true }, '');
    if (!this.reducedMotion()) {
      // opacity, not visibility: a hidden window would drop the focus it has just been given
      this.tween = gsap.from(this.panel().nativeElement, { ...this.atCard(), opacity: 0, duration: 0.45, ease: 'power3.out', clearProps: 'all' });
    }
  }

  ngOnDestroy(): void {
    this.tween?.kill();
    document.documentElement.classList.remove('vck-overlay-open');
  }

  /** Ask to close: going back removes our history entry, and that closes the window. */
  close(): void {
    if (history.state?.[HISTORY_MARK]) history.back();
    else this.leave();
  }

  onCancel(event: Event): void {
    event.preventDefault();
    this.close();
  }

  /** A click on the dimmed page behind lands on the dialog itself, not on anything inside it. */
  onBackdrop(event: MouseEvent): void {
    if (event.target === this.dialog().nativeElement) this.close();
  }

  @HostListener('window:popstate')
  leave(): void {
    if (this.leaving) return;
    this.leaving = true;
    const finish = (): void => {
      this.dialog().nativeElement.close();
      this.closed.emit();
    };
    this.tween?.kill();
    if (this.reducedMotion()) finish();
    else this.tween = gsap.to(this.panel().nativeElement, { ...this.atCard(), opacity: 0, duration: 0.3, ease: 'power2.in', onComplete: finish });
  }

  private reducedMotion(): boolean {
    return matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /** The window shrunk onto the card it came from (same shape, so the text is never stretched). */
  private atCard(): { x: number; y: number; scale: number } {
    const card = this.opened().from.getBoundingClientRect();
    const panel = this.panel().nativeElement;
    const box = this.dialog().nativeElement.getBoundingClientRect();
    return {
      x: card.left + card.width / 2 - (box.left + box.width / 2),
      y: card.top + card.height / 2 - (box.top + box.height / 2),
      scale: Math.min(1, card.width / panel.offsetWidth)
    };
  }
}
