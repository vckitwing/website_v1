import { gsap } from 'gsap';

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
    const starMeaningMark = root.querySelector<SVGPolygonElement>('.star-meaning-mark');
    const starFlight = root.querySelector<HTMLElement>('.star-flight');
    const heading = root.querySelector<HTMLElement>('.flag-heading');
    const scrollHint = root.querySelector<HTMLElement>('.flag-scroll-hint');

    if (!figure || !blue || !red || !star || !aura || !blueCard || !redCard || !starMeaning || !starMeaningMark || !starFlight || !heading || !scrollHint) return;

    const mobile = conditions.isMobile;
    const starBounds = star.getBBox();
    const getStarFlight = () => {
      const sectionBounds = root.getBoundingClientRect();
      const sourceBounds = star.getBoundingClientRect();
      const markBounds = starMeaningMark.getBoundingClientRect();
      const expansionScale = mobile ? 1.08 : 1.2;
      const width = figure.clientWidth * starBounds.width / 900 * expansionScale * 1.08;
      const height = figure.clientHeight * starBounds.height / 600 * expansionScale * 1.08;

      return {
        sourceX: sourceBounds.left + sourceBounds.width / 2 - sectionBounds.left,
        sourceY: sourceBounds.top + sourceBounds.height / 2 - sectionBounds.top,
        targetX: markBounds.left + markBounds.width / 2 - sectionBounds.left,
        targetY: markBounds.top + markBounds.height / 2 - sectionBounds.top,
        width: Math.max(width, 1),
        height: Math.max(height, 1),
        scale: starMeaningMark.clientWidth / Math.max(width, 1)
      };
    };

    gsap.set(blue, { scaleY: 0, transformOrigin: '50% 0%' });
    gsap.set(red, { scaleY: 0, transformOrigin: '50% 100%' });
    gsap.set(star, { scale: 0, rotation: -32, autoAlpha: 0, transformOrigin: '50% 50%' });
    gsap.set(aura, { scale: .35, autoAlpha: 0, transformOrigin: '50% 50%' });
    gsap.set(blueCard, { x: mobile ? 0 : -48, y: 26, autoAlpha: 0 });
    gsap.set(redCard, { x: mobile ? 0 : 48, y: 26, autoAlpha: 0 });
    gsap.set(starFlight, { xPercent: -50, yPercent: -50, autoAlpha: 0 });
    gsap.set(starMeaning, { autoAlpha: 0 });
    gsap.set(starMeaningMark, { scale: .55, rotation: -40, autoAlpha: 0, transformOrigin: '50% 50%' });

    const timeline = gsap.timeline({
      defaults: { ease: 'power2.inOut' },
      scrollTrigger: {
        trigger: section,
        start: 'top 82%',
        end: 'bottom bottom',
        scrub: mobile ? .35 : .65,
        invalidateOnRefresh: true
      }
    });

    timeline
      .addLabel('formation', 0)
      .to(blue, { scaleY: 1, duration: .65 }, 0)
      .to(red, { scaleY: 1, duration: .65 }, .12)
      .to(figure, { autoAlpha: 1, scale: .94, duration: .8 }, 0)
      .to(star, { scale: 1, rotation: 0, autoAlpha: 1, duration: .55, ease: 'back.out(1.8)' }, .4)
      .to(aura, { scale: 1, autoAlpha: .65, duration: .6 }, .4)
      .addLabel('expansion', 1.15)
      .to(figure, { scale: mobile ? 1.08 : 1.2, duration: .8 }, 1.15)
      .to(aura, { scale: 1.35, autoAlpha: .88, duration: .75 }, 1.2)
      .addLabel('separation', 2.05)
      .to(blue, {
        attr: mobile
          ? { x: 0, y: -38, width: 900, height: 230 }
          : { x: 35, y: 112, width: 330, height: 376 },
        duration: .85
      }, 2.05)
      .to(red, {
        attr: mobile
          ? { x: 0, y: 408, width: 900, height: 230 }
          : { x: 535, y: 112, width: 330, height: 376 },
        duration: .85
      }, 2.05)
      .to([blue, red], { autoAlpha: 0, duration: .42 }, 2.52)
      .to(star, { scale: 1.08, duration: .55 }, 2.16)
      .to(aura, { autoAlpha: 0, duration: .35 }, 2.7)
      .to(star, { autoAlpha: 0, duration: .12 }, 3.4)
      .to(heading, { y: -16, autoAlpha: 0, duration: .45, ease: 'power2.out' }, 2.12)
      .to(scrollHint, { autoAlpha: 0, duration: .35 }, 2.12)
      .addLabel('colourCards', 2.42)
      .to(blueCard, { x: 0, y: 0, autoAlpha: 1, duration: .72, ease: 'power2.out' }, 2.42)
      .to(redCard, { x: 0, y: 0, autoAlpha: 1, duration: .72, ease: 'power2.out' }, 2.56)
      .addLabel('starMeaning', 3.32)
      .to(starMeaning, { autoAlpha: 1, duration: .65, ease: 'power2.out' }, 3.32)
      .set(starFlight, {
        x: () => getStarFlight().sourceX,
        y: () => getStarFlight().sourceY,
        width: () => getStarFlight().width,
        height: () => getStarFlight().height,
        scale: 1,
        xPercent: -50,
        yPercent: -50,
        autoAlpha: 0
      }, 3.32)
      .to(starFlight, {
        x: () => getStarFlight().targetX,
        y: () => getStarFlight().targetY,
        scale: () => getStarFlight().scale,
        duration: .9,
        ease: 'power2.inOut'
      }, 3.32)
      .to(starFlight, { autoAlpha: 1, duration: .12 }, 3.32)
      .to(starFlight, { autoAlpha: 0, duration: .12 }, 4.1)
      .to(starMeaningMark, {
        scale: 1,
        rotation: 0,
        autoAlpha: 1,
        duration: .18,
        ease: 'back.out(1.6)'
      }, 4.1);

    return () => timeline.scrollTrigger?.kill();
  });

  return () => media.revert();
}
