import { gsap } from 'gsap';
import { registerStarLeg, svgStarBox } from '@shared/story/star-journey-controller';

type ThinkersConditions = {
  isMobile: boolean;
  reduce: boolean;
};

type Chapter = {
  root: HTMLElement;
  frame: HTMLElement;
  image: HTMLElement;
  ring: HTMLElement;
  monogram: HTMLElement;
  numeral: HTMLElement;
  words: HTMLElement[];
  rest: HTMLElement[];
  rule: HTMLElement;
};

/**
 * The thinkers section: a pinned stage that shows one thinker at a time. The first thinker wipes in as the section
 * arrives; scrolling then hands over to the next one (the portrait wipes away upward while the next wipes in from below,
 * names rise out of their masks, the accent colour moves on). The journey star lands on the progress rail beside the stage
 * and becomes its marker. With reduced motion the three thinkers simply follow one another.
 */
export async function createThinkersAnimation(root: HTMLElement): Promise<() => void> {
  const { ScrollTrigger } = await import('gsap/ScrollTrigger');
  gsap.registerPlugin(ScrollTrigger);

  const stage = root.querySelector<HTMLElement>('.th-stage');
  const chapterRoots = Array.from(root.querySelectorAll<HTMLElement>('.th-chapter'));
  const rail = root.querySelector<HTMLElement>('.th-rail');
  const ticks = Array.from(root.querySelectorAll<HTMLElement>('.th-tick'));
  const railStar = root.querySelector<SVGSVGElement>('.th-rail-star');
  const railFill = root.querySelector<HTMLElement>('.th-rail-fill');
  const glowBlue = root.querySelector<HTMLElement>('.th-glow-blue');
  const glowRed = root.querySelector<HTMLElement>('.th-glow-red');
  const historyHost = root.closest('vck-root')?.querySelector('vck-history-section');
  const historyMarker = historyHost?.querySelector<HTMLElement>('.history-star-marker');

  if (!stage || chapterRoots.length !== 3 || !rail || ticks.length !== 3 || !railStar || !railFill || !glowBlue || !glowRed) {
    throw new Error('The thinkers section requires its stage, three chapters and its progress rail.');
  }

  const q = <T extends HTMLElement>(parent: HTMLElement, selector: string): T => {
    const element = parent.querySelector<T>(selector);
    if (!element) throw new Error(`The thinkers section is missing ${selector}.`);
    return element;
  };
  const chapters: Chapter[] = chapterRoots.map((chapterRoot) => ({
    root: chapterRoot,
    frame: q(chapterRoot, '.th-frame'),
    image: q(chapterRoot, '.th-image'),
    ring: q(chapterRoot, '.th-ring'),
    monogram: q(chapterRoot, '.th-monogram'),
    numeral: q(chapterRoot, '.th-numeral'),
    words: Array.from(chapterRoot.querySelectorAll<HTMLElement>('.th-word > span')),
    rest: [q(chapterRoot, '.th-count'), q(chapterRoot, '.th-alt'), q(chapterRoot, '.th-desc')],
    rule: q(chapterRoot, '.th-rule')
  }));

  const media = gsap.matchMedia(root);
  media.add({ isDesktop: '(min-width: 761px)', isMobile: '(max-width: 760px)', reduce: '(prefers-reduced-motion: reduce)' }, (context) => {
    const { isMobile, reduce } = context.conditions as ThinkersConditions;
    if (reduce) {
      root.classList.add('is-static');
      return () => root.classList.remove('is-static');
    }

    const radius = Number.parseFloat(getComputedStyle(chapters[0]!.frame).borderTopLeftRadius) || 28;
    const HIDDEN = `inset(100% 0% 0% 0% round ${radius}px)`;
    const SHOWN = `inset(0% 0% 0% 0% round ${radius}px)`;
    const GONE = `inset(0% 0% 100% 0% round ${radius}px)`;
    const RING_OPACITY = 0.7;
    const MONOGRAM_OPACITY = 0.5;

    // Every chapter starts "before its entrance"; the first one's container is on screen, the others are hidden.
    chapters.forEach((chapter, index) => {
      gsap.set(chapter.root, { autoAlpha: index === 0 ? 1 : 0 });
      gsap.set(chapter.frame, { clipPath: HIDDEN });
      gsap.set(chapter.image, { scale: 1.35, yPercent: 8 });
      gsap.set(chapter.ring, { autoAlpha: 0, x: -30, y: 30 });
      gsap.set(chapter.monogram, { autoAlpha: 0, xPercent: 14 });
      gsap.set(chapter.numeral, { autoAlpha: 0, yPercent: 12 });
      gsap.set(chapter.words, { yPercent: 118 });
      gsap.set(chapter.rest, { autoAlpha: 0, y: 26 });
      gsap.set(chapter.rule, { scaleX: 0, transformOrigin: 'left center' });
    });
    gsap.set(railFill, isMobile ? { scaleX: 0 } : { scaleY: 0 });
    gsap.set(glowRed, { opacity: 0.4 });
    gsap.set(glowBlue, { opacity: 1 });

    // fromTo that never renders its "from" at creation (the chapters' starting states are set above).
    const move = (timeline: gsap.core.Timeline, target: gsap.TweenTarget, from: gsap.TweenVars, to: gsap.TweenVars, at: number): void => {
      timeline.fromTo(target, from, { ...to, immediateRender: false }, at);
    };

    const enter = (timeline: gsap.core.Timeline, c: Chapter, at: number): void => {
      move(timeline, c.frame, { clipPath: HIDDEN }, { clipPath: SHOWN, duration: 0.6, ease: 'power3.out' }, at);
      move(timeline, c.image, { scale: 1.35, yPercent: 8 }, { scale: 1, yPercent: 0, duration: 0.9, ease: 'power2.out' }, at);
      move(timeline, c.ring, { autoAlpha: 0, x: -30, y: 30 }, { autoAlpha: RING_OPACITY, x: 0, y: 0, duration: 0.7, ease: 'power3.out' }, at + 0.12);
      move(timeline, c.monogram, { autoAlpha: 0, xPercent: 14 }, { autoAlpha: MONOGRAM_OPACITY, xPercent: 0, duration: 0.8, ease: 'power3.out' }, at + 0.05);
      move(timeline, c.numeral, { autoAlpha: 0, yPercent: 12 }, { autoAlpha: 1, yPercent: 0, duration: 0.9, ease: 'power2.out' }, at);
      move(timeline, c.words, { yPercent: 118 }, { yPercent: 0, duration: 0.65, ease: 'power3.out', stagger: 0.07 }, at + 0.12);
      move(timeline, c.rest, { autoAlpha: 0, y: 26 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out', stagger: 0.09 }, at + 0.28);
      move(timeline, c.rule, { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: 'power3.out' }, at + 0.3);
    };

    const exit = (timeline: gsap.core.Timeline, c: Chapter, at: number): void => {
      move(timeline, c.frame, { clipPath: SHOWN }, { clipPath: GONE, duration: 0.5, ease: 'power3.in' }, at);
      move(timeline, c.image, { scale: 1, yPercent: 0 }, { scale: 1.12, yPercent: -6, duration: 0.5, ease: 'power2.in' }, at);
      move(timeline, c.ring, { autoAlpha: RING_OPACITY, x: 0, y: 0 }, { autoAlpha: 0, x: 30, y: -30, duration: 0.4, ease: 'power2.in' }, at);
      move(timeline, c.monogram, { autoAlpha: MONOGRAM_OPACITY, xPercent: 0 }, { autoAlpha: 0, xPercent: -14, duration: 0.45, ease: 'power2.in' }, at);
      move(timeline, c.numeral, { autoAlpha: 1, yPercent: 0 }, { autoAlpha: 0, yPercent: -12, duration: 0.5, ease: 'power2.in' }, at);
      move(timeline, c.words, { yPercent: 0 }, { yPercent: -118, duration: 0.4, ease: 'power3.in', stagger: 0.04 }, at);
      move(timeline, c.rest, { autoAlpha: 1, y: 0 }, { autoAlpha: 0, y: -22, duration: 0.3, ease: 'power2.in', stagger: 0.04 }, at);
      move(timeline, c.rule, { scaleX: 1 }, { scaleX: 0, duration: 0.3, ease: 'power2.in' }, at);
      timeline.set(c.root, { autoAlpha: 0 }, at + 0.55);
    };

    // 1) The first thinker arrives with the section (time based, once), so the stage is already composed when it pins.
    const intro = gsap.timeline({ paused: true });
    enter(intro, chapters[0]!, 0);
    const introTrigger = ScrollTrigger.create({ trigger: stage, start: 'top 85%', once: true, onEnter: () => intro.play() });

    // 2) While pinned, the scroll hands over from thinker to thinker.
    const railPosition = (index: number): { x: number; y: number } => {
      const railBounds = rail.getBoundingClientRect();
      const tick = ticks[index]!.getBoundingClientRect();
      const starHalf = railStar.getBoundingClientRect().width / 2;
      return {
        x: tick.left - railBounds.left + tick.width / 2 - starHalf,
        y: tick.top - railBounds.top + tick.height / 2 - starHalf
      };
    };

    const scrub = gsap.timeline({ defaults: { ease: 'none' } });
    const fillAxis = isMobile ? 'scaleX' : 'scaleY';

    // thinker 1 -> thinker 2
    scrub.set(chapters[1]!.root, { autoAlpha: 1 }, 0.62);
    exit(scrub, chapters[0]!, 0.45);
    enter(scrub, chapters[1]!, 0.62);
    scrub.fromTo(railStar, { x: () => railPosition(0).x, y: () => railPosition(0).y }, { x: () => railPosition(1).x, y: () => railPosition(1).y, duration: 0.7, ease: 'power2.inOut' }, 0.5);
    scrub.to(railFill, { [fillAxis]: 0.5, duration: 0.7, ease: 'power2.inOut' }, 0.5);
    scrub.to(glowRed, { opacity: 0.9, duration: 0.8, ease: 'power2.inOut' }, 0.5);
    scrub.to(glowBlue, { opacity: 0.45, duration: 0.8, ease: 'power2.inOut' }, 0.5);

    // thinker 2 -> thinker 3
    scrub.set(chapters[2]!.root, { autoAlpha: 1 }, 1.82);
    exit(scrub, chapters[1]!, 1.65);
    enter(scrub, chapters[2]!, 1.82);
    scrub.fromTo(railStar, { x: () => railPosition(1).x, y: () => railPosition(1).y }, { x: () => railPosition(2).x, y: () => railPosition(2).y, duration: 0.7, ease: 'power2.inOut', immediateRender: false }, 1.7);
    scrub.to(railFill, { [fillAxis]: 1, duration: 0.7, ease: 'power2.inOut' }, 1.7);
    scrub.to(glowBlue, { opacity: 1, duration: 0.8, ease: 'power2.inOut' }, 1.7);
    scrub.to(glowRed, { opacity: 0.6, duration: 0.8, ease: 'power2.inOut' }, 1.7);

    // a short hold on the last thinker before the page moves on
    scrub.to({}, { duration: 0.6 }, 2.55);

    const pin = ScrollTrigger.create({
      trigger: stage,
      start: 'top top',
      end: () => `+=${Math.round(window.innerHeight * 3.4)}`,
      pin: true,
      anticipatePin: 1,
      scrub: true,
      animation: scrub,
      invalidateOnRefresh: true
    });

    // The star flying in from the history timeline lands on the rail and becomes its marker.
    let removeLeg: (() => void) | undefined;
    let cancelled = false;
    if (historyHost && historyMarker) {
      void registerStarLeg(root, {
        id: 'history-to-thinkers',
        start: () => historyHost.getBoundingClientRect().bottom + window.scrollY - window.innerHeight,
        end: () => pin.start,
        from: () => svgStarBox(historyMarker.querySelector('svg') ?? historyMarker),
        to: () => svgStarBox(railStar),
        source: historyMarker,
        target: railStar
      }).then((remove) => {
        if (cancelled) remove();
        else removeLeg = remove;
      });
    } else {
      gsap.set(railStar, { autoAlpha: 1 });
    }

    return () => {
      cancelled = true;
      removeLeg?.();
      introTrigger.kill();
      intro.kill();
      pin.kill();
      scrub.kill();
      gsap.set(
        [stage, rail, railStar, railFill, glowBlue, glowRed, ...chapters.flatMap((c) => [c.root, c.frame, c.image, c.ring, c.monogram, c.numeral, c.rule, ...c.words, ...c.rest])],
        { clearProps: 'all' }
      );
    };
  });

  return () => media.revert();
}
