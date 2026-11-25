import { gsap } from 'gsap';
import { getFlagStarArrivalScroll, getFlagStarBounds } from '@shared/story/flag-star-geometry';
import { rectStarBox, registerStarLeg, svgStarBox } from '@shared/story/star-journey-controller';

type AnimationConditions = {
  isDesktop: boolean;
  isMobile: boolean;
  reduceMotion: boolean;
};

export async function createFlagAnimation(root: HTMLElement): Promise<() => void> {
  const { ScrollTrigger } = await import('gsap/ScrollTrigger');
  gsap.registerPlugin(ScrollTrigger);
  const media = gsap.matchMedia(root);

  media.add({
    isDesktop: '(min-width: 1101px)',
    isMobile: '(max-width: 1100px)',
    reduceMotion: '(prefers-reduced-motion: reduce)'
  }, (context) => {
    const conditions = context.conditions as AnimationConditions;
    if (conditions.reduceMotion) return;

    const section = root;
    const figure = root.querySelector<HTMLElement>('.flag-figure');
    const blue = root.querySelector<SVGRectElement>('.flag-field-blue');
    const red = root.querySelector<SVGRectElement>('.flag-field-red');
    const star = root.querySelector<SVGPolygonElement>('.flag-star');
    const aura = root.querySelector<SVGCircleElement>('.flag-star-aura');
    const cards = Array.from(root.querySelectorAll<HTMLElement>('.meaning-card'));
    const [blueCard, redCard] = cards;
    const starMeaning = root.querySelector<HTMLElement>('.star-meaning');
    const starMeaningMark = root.querySelector<SVGSVGElement>('.star-meaning-mark');
    const heading = root.querySelector<HTMLElement>('.flag-heading');
    const scrollHint = root.querySelector<HTMLElement>('.flag-scroll-hint');

    if (!figure || !blue || !red || !star || !aura || !blueCard || !redCard || !starMeaning || !starMeaningMark || !heading || !scrollHint) return;

    const mobile = conditions.isMobile;
    const separationAt = mobile ? 4 : 2.05;
    const cardsTakeOverAt = separationAt + .8; // the panels have arrived at the cards
    const starMeaningAt = mobile ? 1.9 : separationAt + .7; // the card is on screen before the star arrives in it
    // The flag's star stays on the flag while the panels start to part, then travels down into the "star at the centre" card.
    const starFlightAt = separationAt + .35;
    const getStarMeaningLift = () => {
      const figureBounds = figure.getBoundingClientRect();
      const meaningBounds = starMeaning.getBoundingClientRect();
      return figureBounds.bottom - meaningBounds.top + 20;
    };

    // The blue and red panels of the flag travel to the exact rectangles of the colour cards (so one turns into the
    // other). Targets are measured against the figure at its final scale and re-measured whenever the layout refreshes.
    const finalFigureScale = mobile ? 1.08 : 1.2;
    type Panel = { x: number; y: number; w: number; h: number; rx: number };
    const flagPanels: Panel[] = [{ x: 0, y: 0, w: 900, h: 300, rx: 0 }, { x: 0, y: 300, w: 900, h: 300, rx: 0 }];
    const measureCardPanels = (): Panel[] => {
      const figureBounds = figure.getBoundingClientRect();
      const currentScale = Number(gsap.getProperty(figure, 'scale')) || 1;
      const unit = (finalFigureScale * (figureBounds.width / currentScale)) / 900; // screen px per SVG unit at the final scale
      const centerX = figureBounds.left + figureBounds.width / 2;
      const centerY = figureBounds.top + figureBounds.height / 2;
      return [blueCard, redCard].map((card) => {
        const bounds = card.getBoundingClientRect();
        const radius = Number.parseFloat(getComputedStyle(card).borderTopLeftRadius) || 0;
        return { x: 450 + (bounds.left - centerX) / unit, y: 300 + (bounds.top - centerY) / unit, w: bounds.width / unit, h: bounds.height / unit, rx: radius / unit };
      });
    };
    let cardPanels = measureCardPanels();
    const morph = { p: 0 };
    const applyMorph = (): void => {
      [blue, red].forEach((rect, index) => {
        const from = flagPanels[index]!;
        const to = cardPanels[index]!;
        const mix = (a: number, b: number) => a + (b - a) * morph.p;
        rect.setAttribute('x', String(mix(from.x, to.x)));
        rect.setAttribute('y', String(mix(from.y, to.y)));
        rect.setAttribute('width', String(mix(from.w, to.w)));
        rect.setAttribute('height', String(mix(from.h, to.h)));
        rect.setAttribute('rx', String(mix(from.rx, to.rx)));
      });
    };

    gsap.set(blue, { scaleY: 0, transformOrigin: '50% 0%' });
    gsap.set(red, { scaleY: 0, transformOrigin: '50% 100%' });
    gsap.set(aura, { scale: .35, autoAlpha: 0, transformOrigin: '50% 50%' });
    gsap.set(cards, { autoAlpha: 0 });
    gsap.set(cards.flatMap((card) => Array.from(card.children)), { autoAlpha: 0, y: 10 });
    gsap.set(starMeaning, { autoAlpha: 0 });
    // The mark is hidden until the star flying down arrives (the page's star journey reveals it).
    gsap.set(starMeaningMark, { autoAlpha: 0 });

    const timeline = gsap.timeline({
      defaults: { ease: 'power2.inOut' },
      scrollTrigger: {
        trigger: section,
        start: conditions.isDesktop ? () => getFlagStarArrivalScroll(star) + 1 : 'top 82%',
        end: 'bottom bottom',
        // Exactly tied to the scroll (no smoothing): the flying star measures this section live, so the two must agree.
        scrub: true,
        invalidateOnRefresh: true,
        onRefresh: () => { cardPanels = measureCardPanels(); applyMorph(); }
      }
    });

    timeline
      .set(starMeaning, { y: () => mobile ? getStarMeaningLift() : 0 }, 0)
      .addLabel('formation', 0)
      .to(blue, { scaleY: 1, duration: .65 }, 0)
      .to(red, { scaleY: 1, duration: .65 }, .12)
      .to(figure, { scale: .94, duration: .8 }, 0)
      .to(aura, { scale: 1, autoAlpha: .65, duration: .6 }, .4)
      .addLabel('expansion', 1.15)
      .to(figure, { scale: finalFigureScale, duration: .8 }, 1.15)
      .to(aura, { scale: 1.35, autoAlpha: .88, duration: .75 }, 1.2)
      .addLabel('separation', separationAt)
      .to(morph, { p: 1, duration: .85, ease: 'power2.inOut', onUpdate: applyMorph }, separationAt)
      .to(aura, { autoAlpha: 0, duration: .35 }, separationAt + .65)
      .to(heading, { y: -16, autoAlpha: 0, duration: .45, ease: 'power2.out' }, separationAt + .07)
      .to(scrollHint, { autoAlpha: 0, duration: .35 }, separationAt + .07)
      .addLabel('colourCards', cardsTakeOverAt)
      // The cards are the same colour as the panels and sit exactly under them, so the hand-over is seamless.
      .to(cards, { autoAlpha: 1, duration: .16, ease: 'none' }, cardsTakeOverAt)
      .to([blue, red], { autoAlpha: 0, duration: .16, ease: 'none' }, cardsTakeOverAt + .06)
      .to(cards.flatMap((card) => Array.from(card.children)), { autoAlpha: 1, y: 0, duration: .5, ease: 'power2.out', stagger: .06 }, cardsTakeOverAt + .12)
      .addLabel('starMeaning', starMeaningAt)
      .to(starMeaning, { autoAlpha: 1, duration: .65, ease: 'power2.out' }, starMeaningAt)
      .to(starMeaning, { y: 0, duration: .85, ease: 'power2.inOut' }, mobile ? separationAt : starMeaningAt);

    // Leg 2 of the star journey: the flag's star travels down and merges with the "star at the centre" card.
    const scrollTrigger = timeline.scrollTrigger;
    let removeLeg: (() => void) | undefined;
    let cancelled = false;
    if (scrollTrigger) {
      const atTime = (time: number): number => scrollTrigger.start + (scrollTrigger.end - scrollTrigger.start) * (time / Math.max(timeline.duration(), 0.01));
      void registerStarLeg(root, {
        id: 'flag-to-star-meaning',
        // The star leaves at the separation, or earlier if the flag's star would otherwise be about to scroll off the top
        // (it leaves while its centre is still at least 30% of the way down the viewport).
        start: () => {
          const bounds = getFlagStarBounds(star);
          const starY = bounds.top + bounds.height / 2 + window.scrollY;
          return Math.min(atTime(starFlightAt), starY - window.innerHeight * 0.3);
        },
        // The flight is given room to breathe (at least half a screen of scrolling) and ends while the card is comfortably
        // on screen (its star at 60% of the viewport height), which can be after the section's own timeline has finished.
        end: () => {
          const start = atTime(starFlightAt);
          const mark = starMeaningMark.getBoundingClientRect();
          const restY = mark.top + mark.height / 2 + window.scrollY - (Number(gsap.getProperty(starMeaning, 'y')) || 0);
          return Math.max(restY - window.innerHeight * 0.6, start + window.innerHeight * 0.5);
        },
        from: () => rectStarBox(getFlagStarBounds(star)),
        to: () => svgStarBox(starMeaningMark),
        source: star,
        target: starMeaningMark
      }).then((remove) => {
        if (cancelled) remove();
        else removeLeg = remove;
      });
    }

    return () => {
      cancelled = true;
      removeLeg?.();
      timeline.scrollTrigger?.kill();
    };
  });

  return () => media.revert();
}
