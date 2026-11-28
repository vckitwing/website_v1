import { gsap } from 'gsap';
import { registerStarLeg, svgStarBox } from '@shared/story/star-journey-controller';

type AnimationConditions = {
  isDesktop: boolean;
  isMobile: boolean;
  reduceMotion: boolean;
};

export async function createIdeologyAnimation(root: HTMLElement, onActiveChange: (index: number) => void): Promise<() => void> {
  const { ScrollTrigger } = await import('gsap/ScrollTrigger');
  gsap.registerPlugin(ScrollTrigger);

  const stage = root.querySelector<HTMLElement>('.ideology-stage');
  const star = root.querySelector<SVGSVGElement>('.ideology-star');
  const faces = Array.from(root.querySelectorAll<SVGPathElement>('.star-point-face'));
  const connections = Array.from(root.querySelectorAll<SVGPathElement>('.star-connection'));
  const travelers = Array.from(root.querySelectorAll<SVGCircleElement>('.star-traveler'));
  const cards = Array.from(root.querySelectorAll<HTMLElement>('.principle-card'));
  const progress = root.querySelector<HTMLElement>('.principle-progress span');
  const host = root.closest('vck-ideology-section');
  const source = host?.previousElementSibling?.querySelector<SVGSVGElement>('.star-meaning-mark');
  const historyHost = host?.nextElementSibling;

  if (!stage || !star || faces.length !== 5 || connections.length !== 5 || travelers.length !== 5 || cards.length !== 5 || !progress || !source) {
    throw new Error('The ideology section requires its five star points, principle cards, and the preceding flag star.');
  }
  const ideologyStar = star;

  const media = gsap.matchMedia(root);
  media.add({
    isDesktop: '(min-width: 761px)',
    isMobile: '(max-width: 760px)',
    reduceMotion: '(prefers-reduced-motion: reduce)'
  }, (context) => {
    const { reduceMotion } = context.conditions as AnimationConditions;
    const removeLegs: Array<() => void> = [];
    let cancelled = false;
    const keep = (promise: Promise<() => void>): void => {
      void promise.then((remove) => {
        if (cancelled) remove();
        else removeLegs.push(remove);
      });
    };

    // The star flying in from the "star at the centre" card lands on this star and reveals it (the page's star journey
    // controls its visibility); with reduced motion it is simply there.
    gsap.set(ideologyStar, { autoAlpha: reduceMotion ? 1 : 0 });
    const highlightDuration = reduceMotion ? .01 : .24;
    const edgeDuration = reduceMotion ? .01 : .34;
    const contentDuration = reduceMotion ? .01 : .22;
    const activeScale = reduceMotion ? 1 : 1.035;

    gsap.set(faces, { scale: 1, transformOrigin: '50% 50%' });
    gsap.set(faces[0], { scale: activeScale });
    gsap.set(connections, { strokeDashoffset: 1, opacity: .16 });
    gsap.set(connections[0], { strokeDashoffset: 0, opacity: .92 });
    gsap.set(travelers, { autoAlpha: 0 });
    gsap.set(cards, { autoAlpha: 0, y: 12 });
    gsap.set(cards[0], { autoAlpha: 1, y: 0 });
    gsap.set(progress, { scaleX: 0 });

    const timeline = gsap.timeline({
      defaults: { ease: 'power1.inOut' },
      scrollTrigger: {
        trigger: root,
        start: 'top top',
        end: 'bottom bottom',
        pin: stage,
        pinSpacing: false,
        // Tied exactly to the scroll: the flying star measures this star live, so the two must agree.
        scrub: true,
        invalidateOnRefresh: true,
        anticipatePin: 1
      }
    });
    timeline.eventCallback('onUpdate', () => {
      const index = Math.min(4, Math.floor(timeline.progress() * 5));
      onActiveChange(index);
    });

    timeline.to(progress, { scaleX: 1, duration: 5, ease: 'none' }, 0);
    for (let index = 0; index < 5; index++) {
      const time = index;
      if (index > 0) {
        timeline
          .to(faces[index - 1], { scale: 1, duration: highlightDuration }, time)
          .to(connections[index - 1], { strokeDashoffset: 1, opacity: .16, duration: edgeDuration }, time)
          .to(cards[index - 1], { autoAlpha: 0, y: reduceMotion ? 0 : -10, duration: contentDuration }, time);
      }
      timeline
        .addLabel(`principle-${index + 1}`, time)
        .to(faces[index], { scale: activeScale, duration: highlightDuration }, time)
        .to(connections[index], { strokeDashoffset: 0, opacity: .92, duration: edgeDuration }, time);
      timeline.to(cards[index], { autoAlpha: 1, y: 0, duration: contentDuration }, time);
    }

    const pointTargets = [
      { x: 50, y: 4 },
      { x: 96, y: 37 },
      { x: 78, y: 92 },
      { x: 22, y: 92 },
      { x: 4, y: 37 }
    ];
    if (!reduceMotion) {
      for (let index = 0; index < pointTargets.length; index++) {
        timeline.fromTo(travelers[index], { attr: { cx: 50, cy: 50 }, autoAlpha: 1 }, {
          attr: { cx: pointTargets[index].x, cy: pointTargets[index].y },
          autoAlpha: 0,
          duration: .38,
          ease: 'power1.inOut'
        }, index);
      }

      const rootTop = (): number => root.getBoundingClientRect().top + window.scrollY;

      // Leg 3 of the star journey: it pops out of the "star at the centre" card as the page scrolls on, and travels down
      // to merge with this star as the section reaches the top (where the stage pins).
      const meaningCard = source.closest<HTMLElement>('.star-meaning');
      keep(registerStarLeg(root, {
        id: 'star-meaning-to-ideology',
        // The star pops out while the card is still on screen (its star 25% of the way down the viewport at the latest),
        // never later than the moment the ideology section's top reaches the bottom of the screen.
        start: () => {
          const mark = source.getBoundingClientRect();
          const lift = meaningCard ? Number(gsap.getProperty(meaningCard, 'y')) || 0 : 0;
          const restY = mark.top + mark.height / 2 + window.scrollY - lift;
          return Math.min(rootTop() - window.innerHeight, restY - window.innerHeight * 0.25);
        },
        end: () => rootTop(),
        from: () => svgStarBox(source),
        to: () => svgStarBox(ideologyStar),
        source,
        target: ideologyStar
      }));

      // Leg 4: once the five faces have been through, the star pops out of the stage and travels on to the history timeline.
      const scrollTrigger = timeline.scrollTrigger;
      const marker = historyHost?.querySelector<HTMLElement>('.history-star-marker');
      const track = historyHost?.querySelector<HTMLElement>('.history-track');
      if (scrollTrigger && marker && track) {
        const markerStar = (): Element => marker.querySelector('svg') ?? marker;
        keep(registerStarLeg(root, {
          id: 'ideology-to-history',
          start: () => scrollTrigger.start + (scrollTrigger.end - scrollTrigger.start) * (4.5 / Math.max(timeline.duration(), 0.01)),
          // The star arrives while the marker (5% down the track) is just over half way up the screen.
          end: () => track.getBoundingClientRect().top + window.scrollY + track.clientHeight * 0.05 - window.innerHeight * 0.55,
          from: () => svgStarBox(ideologyStar),
          to: () => svgStarBox(markerStar()),
          source: ideologyStar,
          target: marker
        }));
      }
    }

    ScrollTrigger.refresh();
    return () => {
      cancelled = true;
      removeLegs.forEach((remove) => remove());
      timeline.scrollTrigger?.kill();
    };
  });

  return () => media.revert();
}
