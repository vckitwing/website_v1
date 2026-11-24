import { gsap } from 'gsap';
import type { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getStarJourneyElements, type StarJourneyElements } from './star-journey';

/**
 * The one star that travels through the whole page (hero -> flag -> "the star at the centre" -> ideology -> history -> thinkers).
 *
 * Design, so the travel is smooth and never shakes:
 *  - ONE overlay star and ONE writer. Sections only register "legs" (from where, to where, between which scroll positions);
 *    they never touch the overlay star themselves, so two animations can never fight over it.
 *  - The star's position is a pure function of the page's scroll position (no scrub smoothing to lag behind the elements it
 *    is flying between). Both ends are measured live each frame, so a moving or scaling end (an animated card, a pinned
 *    stage) is always met exactly.
 *  - Only transforms change (the overlay is a fixed-size box scaled with scaleX / scaleY), never width / height, so the
 *    glow filter is not re-laid-out every frame.
 *  - The real stars at both ends cross-fade with the flying one, so each hand-over happens in place.
 */

/** The star shape's own box in viewport pixels: its centre and size. */
export type StarBox = { x: number; y: number; width: number; height: number };

export type StarLeg = {
  id: string;
  /** Document scroll position where the flight starts / ends (read again whenever ScrollTrigger refreshes). */
  start: () => number;
  end: () => number;
  /** Live viewport boxes of the two ends, read every frame. */
  from: () => StarBox;
  to: () => StarBox;
  /** The real star left behind: visible until the flight starts, then fades out as the flying star takes over. */
  source?: Element | null;
  /** The real star flown to: hidden until the flight ends, then fades in as the flying star dissolves into it. */
  target?: Element | null;
  /** The target is already on screen before the flight (the flag's static star), so it is never hidden. */
  targetAlwaysVisible?: boolean;
};

/** The overlay star is a fixed box; its polygon spans x 4..96 and y 4..92 of the 100-unit viewBox. */
export const OVERLAY_BOX = 480; // drawn large and only ever scaled DOWN, so the star stays crisp (scaling a small bitmap up blurs it)
const POLYGON_WIDTH = 0.92;
const POLYGON_HEIGHT = 0.88;
const POLYGON_CENTRE_OFFSET = 0.02; // the polygon's centre sits 2% of the box above the box's centre
const MIN_GAP = 60; // px of scroll between one flight landing and the next one starting

const clamp01 = (value: number): number => Math.min(1, Math.max(0, value));
const smooth = (value: number): number => {
  const t = clamp01(value);
  return t * t * (3 - 2 * t);
};
const easeInOut = (t: number): number => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

/** Box of a star drawn in a 100-unit viewBox (`<svg viewBox="0 0 100 100">` whose polygon spans x 4..96, y 4..92). */
export function svgStarBox(svg: Element): StarBox {
  const rect = svg.getBoundingClientRect();
  const width = rect.width * POLYGON_WIDTH;
  const height = rect.height * POLYGON_HEIGHT;
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height * (0.04 + POLYGON_HEIGHT / 2), width, height };
}

/** Box from an already-measured rectangle (the star's own bounding box). */
export function rectStarBox(rect: DOMRect): StarBox {
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, width: rect.width, height: rect.height };
}

type Metrics = { start: number; end: number };

class StarJourneyController {
  private readonly legs: StarLeg[] = [];
  private readonly metrics = new Map<StarLeg, Metrics>();
  private readonly lastAlpha = new WeakMap<Element, number>();
  private readonly touched = new Set<Element>();
  private trigger?: ScrollTrigger;
  private lastOverlayAlpha = -1;
  private readonly onRefresh = (): void => {
    this.measure();
    this.render();
  };

  constructor(private readonly journey: StarJourneyElements, private readonly scrollTrigger: typeof ScrollTrigger) {
    gsap.set(journey.star, { xPercent: -50, yPercent: -50, transformOrigin: '50% 50%' });
    gsap.set(journey.overlay, { autoAlpha: 0 });
    scrollTrigger.addEventListener('refresh', this.onRefresh);
    this.trigger = scrollTrigger.create({ start: 0, end: 'max', onUpdate: () => this.render() });
  }

  add(leg: StarLeg): () => void {
    this.legs.push(leg);
    this.measure();
    this.render();
    return () => this.remove(leg);
  }

  private remove(leg: StarLeg): void {
    const index = this.legs.indexOf(leg);
    if (index >= 0) this.legs.splice(index, 1);
    this.metrics.delete(leg);
    [leg.source, leg.target].forEach((element) => {
      if (element && !this.legs.some((other) => other.source === element || other.target === element)) {
        gsap.set(element, { clearProps: 'opacity,visibility' });
        this.touched.delete(element);
        this.lastAlpha.delete(element);
      }
    });
    this.render();
  }

  get isEmpty(): boolean {
    return this.legs.length === 0;
  }

  destroy(): void {
    this.scrollTrigger.removeEventListener('refresh', this.onRefresh);
    this.trigger?.kill();
    gsap.set(this.journey.overlay, { autoAlpha: 0 });
  }

  /**
   * Re-reads every leg's scroll range (called after ScrollTrigger has refreshed all section triggers). Legs never overlap:
   * if one would start before the previous one has landed, it starts a short way after it instead.
   */
  private measure(): void {
    const raw = this.legs
      .map((leg) => ({ leg, start: leg.start(), end: leg.end() }))
      .sort((a, b) => a.start - b.start);
    let previousEnd = -Infinity;
    raw.forEach(({ leg, start, end }) => {
      const begin = Math.max(start, previousEnd + MIN_GAP);
      const finish = Math.max(end, begin + 1);
      this.metrics.set(leg, { start: begin, end: finish });
      previousEnd = finish;
    });
  }

  private setAlpha(element: Element, alpha: number): void {
    const value = Math.round(alpha * 1000) / 1000;
    if (this.lastAlpha.get(element) === value) return;
    this.lastAlpha.set(element, value);
    this.touched.add(element);
    gsap.set(element, { autoAlpha: value });
  }

  private render(): void {
    const scroll = window.scrollY;
    const alphas = new Map<Element, number>();
    const limit = (element: Element, alpha: number): void => {
      alphas.set(element, Math.min(alphas.get(element) ?? 1, alpha));
    };
    let flying: { leg: StarLeg; p: number; fadeIn: number; fadeOut: number } | undefined;

    for (const leg of this.legs) {
      const metrics = this.metrics.get(leg);
      if (!metrics) continue;
      const raw = (scroll - metrics.start) / (metrics.end - metrics.start);
      const p = clamp01(raw);
      const fadeIn = smooth(p / 0.1); // the flying star appears as the source disappears
      const fadeOut = smooth((p - 0.88) / 0.12); // the flying star dissolves as the target appears
      if (raw > 0 && raw < 1 && !flying) flying = { leg, p, fadeIn, fadeOut };
      if (leg.source) limit(leg.source, 1 - fadeIn);
      if (leg.target && !leg.targetAlwaysVisible) limit(leg.target, fadeOut);
    }

    alphas.forEach((alpha, element) => this.setAlpha(element, alpha));

    const { star } = this.journey;
    if (!flying) {
      this.setOverlay(0);
      return;
    }
    const { leg, p, fadeIn, fadeOut } = flying;
    const from = leg.from();
    const to = leg.to();
    if (from.width < 1 || to.width < 1) {
      this.setOverlay(0);
      return;
    }
    const e = easeInOut(p);
    const pop = 1 + 0.2 * Math.sin(Math.PI * clamp01(p / 0.14)); // a small pop as the star leaves its source
    const width = (from.width + (to.width - from.width) * e) * pop;
    const height = (from.height + (to.height - from.height) * e) * pop;
    const scaleX = width / (POLYGON_WIDTH * OVERLAY_BOX);
    const scaleY = height / (POLYGON_HEIGHT * OVERLAY_BOX);
    const x = from.x + (to.x - from.x) * e;
    const y = from.y + (to.y - from.y) * e + POLYGON_CENTRE_OFFSET * OVERLAY_BOX * scaleY;
    gsap.set(star, { x, y, scaleX, scaleY, rotation: -14 * Math.sin(Math.PI * e) });
    this.setOverlay(Math.min(fadeIn, 1 - fadeOut));
  }

  private setOverlay(alpha: number): void {
    const value = Math.round(alpha * 1000) / 1000;
    if (value === this.lastOverlayAlpha) return;
    this.lastOverlayAlpha = value;
    gsap.set(this.journey.overlay, { autoAlpha: value });
  }
}

let controller: StarJourneyController | undefined;

/** Registers a flight with the page's single star journey. Returns a function that removes it again. */
export async function registerStarLeg(anyElementInApp: Element, leg: StarLeg): Promise<() => void> {
  const { ScrollTrigger } = await import('gsap/ScrollTrigger');
  gsap.registerPlugin(ScrollTrigger);
  if (!controller) controller = new StarJourneyController(getStarJourneyElements(anyElementInApp), ScrollTrigger);
  const remove = controller.add(leg);
  return () => {
    remove();
    if (controller?.isEmpty) {
      controller.destroy();
      controller = undefined;
    }
  };
}
