import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, OnDestroy, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { gsap } from 'gsap';
import { SIGNATURE_FILL_PATH, SIGNATURE_STROKES, SIGNATURE_VIEWBOX, type SignatureGroup } from './signature-strokes';

/** Pen speed per group, in source-image pixels per second. The underline is a quick confident sweep. */
const SPEED: Record<SignatureGroup, number> = { main: 140, underline: 300, date: 105, marks: 120 };
/** Pause when the pen lifts between groups, and between strokes that are far apart (seconds). */
const GROUP_PAUSE = 0.28;
const LIFT_PAUSE = 0.03;
const LIFT_DISTANCE = 9;

let nextId = 0;

/**
 * A signature that writes itself when it scrolls into view.
 *
 * The visible ink is the traced outline of the supplied signature (`SIGNATURE_FILL_PATH`, transparent background);
 * it is revealed through an SVG mask whose pen strokes are animated with stroke-dasharray / stroke-dashoffset,
 * in writing order: main signature, underline, date, remaining marks. The finished signature stays on screen.
 * Regenerate the data with `npm run trace:signature`.
 */
@Component({
  selector: 'vck-handwritten-signature',
  standalone: true,
  templateUrl: './handwritten-signature.component.html',
  styleUrl: './handwritten-signature.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HandwrittenSignatureComponent implements AfterViewInit, OnDestroy {
  /** Accessible name for the signature image. */
  @Input() label = 'Handwritten signature';
  /** 'viewport' writes when scrolled into view; 'manual' waits for `play()` (e.g. until an intro has finished). */
  @Input() trigger: 'viewport' | 'manual' = 'viewport';
  /** When true, the signature is wiped and writes itself again each time it scrolls back into view (e.g. scrolling up to the hero). */
  @Input() replay = false;

  @ViewChild('figure', { static: true }) private figureRef!: ElementRef<HTMLElement>;
  @ViewChildren('penStroke') private penStrokes!: QueryList<ElementRef<SVGPathElement>>;

  readonly maskId = `vck-signature-mask-${nextId++}`;
  readonly strokes = SIGNATURE_STROKES;
  readonly fillPath = SIGNATURE_FILL_PATH;
  readonly viewBox = `${SIGNATURE_VIEWBOX.x} ${SIGNATURE_VIEWBOX.y} ${SIGNATURE_VIEWBOX.width} ${SIGNATURE_VIEWBOX.height}`;
  readonly box = SIGNATURE_VIEWBOX;

  private observer?: IntersectionObserver;
  private reentryObserver?: IntersectionObserver;
  private timeline?: gsap.core.Timeline;

  ngAfterViewInit(): void {
    const paths = this.penStrokes.map((ref) => ref.nativeElement);

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || typeof IntersectionObserver === 'undefined') {
      gsap.set(paths, { strokeDasharray: 'none', strokeDashoffset: 0 });
      return;
    }

    // Hide every stroke with its exact length (the stylesheet hides them until this runs). The gap is longer than
    // the dash so the wrapped-around pattern can never leave a stray dot at the end of a hidden stroke.
    paths.forEach((path) => {
      const length = path.getTotalLength();
      gsap.set(path, { strokeDasharray: `${length} ${length + 10}`, strokeDashoffset: length + 1 });
    });

    this.timeline = this.buildTimeline(paths);
    if (this.trigger === 'manual') return;
    this.observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      this.observer?.disconnect();
      this.timeline?.play();
      if (this.replay) this.watchForReentry();
    }, { threshold: 0.45 });
    this.observer.observe(this.figureRef.nativeElement);
  }

  /** Starts writing (once). Used with `trigger="manual"`. With `replay`, it then re-signs whenever it scrolls back into view. */
  play(): void {
    this.observer?.disconnect();
    if (this.timeline && !this.timeline.isActive() && this.timeline.progress() === 0) this.timeline.play();
    if (this.replay) this.watchForReentry();
  }

  /** Once it has been written, wipe it when it leaves the viewport and write it again when it comes back. */
  private watchForReentry(): void {
    if (!this.timeline || typeof IntersectionObserver === 'undefined' || this.reentryObserver) return;
    let armed = false;
    this.reentryObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) {
          armed = true; // fully scrolled out: clear it, ready for the next visit
          this.timeline?.pause(0);
        } else if (armed && entry.intersectionRatio >= 0.45) {
          armed = false;
          this.timeline?.restart();
        }
      }
    }, { threshold: [0, 0.45] });
    this.reentryObserver.observe(this.figureRef.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    this.reentryObserver?.disconnect();
    this.timeline?.kill();
  }

  private buildTimeline(paths: SVGPathElement[]): gsap.core.Timeline {
    const timeline = gsap.timeline({ paused: true });
    let previousGroup: SignatureGroup | undefined;
    let penX = 0;
    let penY = 0;

    this.strokes.forEach((stroke, index) => {
      const path = paths[index];
      if (!path) return;
      const length = path.getTotalLength();
      const start = path.getPointAtLength(0);
      const end = path.getPointAtLength(length);

      let pause = 0;
      if (previousGroup && previousGroup !== stroke.group) pause = GROUP_PAUSE;
      else if (previousGroup && Math.hypot(start.x - penX, start.y - penY) > LIFT_DISTANCE) pause = LIFT_PAUSE;

      // One long stroke (the underline) eases in and out like a real sweep; short pieces keep a steady pen.
      const ease = length > 120 ? 'power1.inOut' : 'none';
      timeline.to(path, {
        strokeDashoffset: 0,
        duration: Math.max(0.015, length / SPEED[stroke.group]),
        ease
      }, pause ? `>+${pause}` : '>');

      previousGroup = stroke.group;
      penX = end.x;
      penY = end.y;
    });
    return timeline;
  }
}
