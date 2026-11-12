import { gsap } from 'gsap';
import { getStarJourneyElements, updateStarThreadPath } from '../../story/star-journey';

type AnimationConditions = {
  isDesktop: boolean;
  isMobile: boolean;
  reduceMotion: boolean;
};

type FlightGeometry = {
  fromX: number;
  fromY: number;
  fromWidth: number;
  fromHeight: number;
  toX: number;
  toY: number;
  toWidth: number;
  toHeight: number;
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

  if (!stage || !star || faces.length !== 5 || connections.length !== 5 || travelers.length !== 5 || cards.length !== 5 || !progress || !source) {
    throw new Error('The ideology section requires its five star points, principle cards, and the preceding flag star.');
  }
  const ideologyStar = star;
  const journey = getStarJourneyElements(root);

  const geometry = (): FlightGeometry => {
    const rootBounds = root.getBoundingClientRect();
    const sourceBounds = source.getBoundingClientRect();
    const targetBounds = ideologyStar.getBoundingClientRect();
    const sectionTop = rootBounds.top + window.scrollY;
    const transitionStart = sectionTop - window.innerHeight;
    const targetCenterX = targetBounds.left + targetBounds.width / 2 + window.scrollX;
    const targetCenterY = targetBounds.top + targetBounds.height / 2 + window.scrollY;

    return {
      fromX: sourceBounds.left + sourceBounds.width / 2 + window.scrollX,
      fromY: sourceBounds.top + sourceBounds.height / 2 + window.scrollY - transitionStart,
      fromWidth: sourceBounds.width,
      fromHeight: sourceBounds.height,
      toX: targetCenterX - window.scrollX,
      toY: targetCenterY - sectionTop,
      toWidth: targetBounds.width,
      toHeight: targetBounds.height
    };
  };

  const media = gsap.matchMedia(root);
  media.add({
    isDesktop: '(min-width: 761px)',
    isMobile: '(max-width: 760px)',
    reduceMotion: '(prefers-reduced-motion: reduce)'
  }, (context) => {
    const { reduceMotion } = context.conditions as AnimationConditions;
    const moveDuration = reduceMotion ? .01 : 1;
    let updateEntryThread = (): void => {};
    let updateExitThread = (): void => {};

    gsap.set(journey.overlay, { autoAlpha: 0 });
    gsap.set(journey.star, { xPercent: -50, yPercent: -50, autoAlpha: 0 });
    gsap.set(journey.thread, { strokeDasharray: 1, strokeDashoffset: 1, autoAlpha: 0 });
    gsap.set(ideologyStar, { autoAlpha: 0 });
    const highlightDuration = reduceMotion ? .01 : .24;
    const edgeDuration = reduceMotion ? .01 : .34;
    const contentDuration = reduceMotion ? .01 : .22;
    const activeScale = reduceMotion ? 1 : 1.035;

    const transition = gsap.timeline({
      defaults: { ease: 'power1.inOut' },
      scrollTrigger: {
        trigger: root,
        start: 'top bottom',
        end: 'top top',
        scrub: reduceMotion ? true : .45,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          if (self.isActive) updateEntryThread();
        }
      }
    });

    if (reduceMotion) {
      transition
        .fromTo(source, { autoAlpha: 1 }, { autoAlpha: 0, duration: .01 }, 0)
        .fromTo(ideologyStar, { autoAlpha: 0 }, { autoAlpha: 1, duration: .01 }, 0);
    } else {
      const entryThreadPath = (): string => {
        const points = geometry();
        updateStarThreadPath(
          journey.threadSvg,
          journey.thread,
          { x: points.fromX, y: points.fromY },
          { x: points.toX, y: points.toY }
        );
        return journey.thread.getAttribute('d') ?? '';
      };
      updateEntryThread = entryThreadPath;

      transition
        .set(journey.thread, {
          strokeDasharray: 1,
          strokeDashoffset: 1,
          autoAlpha: 1,
          immediateRender: false
        }, 0)
        .fromTo(journey.star, {
          x: () => geometry().fromX,
          y: () => geometry().fromY,
          width: () => geometry().fromWidth,
          height: () => geometry().fromHeight,
          autoAlpha: 0,
          xPercent: -50,
          yPercent: -50
        }, {
          x: () => geometry().toX,
          y: () => geometry().toY,
          width: () => geometry().toWidth,
          height: () => geometry().toHeight,
          autoAlpha: 1,
          duration: moveDuration * .78,
          ease: 'none',
          immediateRender: false
        }, 0)
        .to(journey.overlay, { autoAlpha: 1, duration: .01 }, 0)
        .fromTo(source, { autoAlpha: 1 }, { autoAlpha: 0, duration: .55 }, 0)
        .to(journey.thread, { strokeDashoffset: 0, duration: moveDuration * .78 }, 0)
        .to(journey.overlay, { autoAlpha: 0, duration: .08 }, .92)
        .to(ideologyStar, { autoAlpha: 1, duration: .2 }, .78);
    }

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
        scrub: reduceMotion ? true : .55,
        invalidateOnRefresh: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          if (self.isActive) updateExitThread();
        }
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

      const getExitGeometry = () => {
        const starBounds = ideologyStar.getBoundingClientRect();
        return {
          from: {
            x: starBounds.left + starBounds.width / 2,
            y: starBounds.top + starBounds.height / 2
          },
          fromWidth: Math.max(starBounds.width, 1),
          fromHeight: Math.max(starBounds.height, 1),
          to: { x: window.innerWidth / 2, y: window.innerHeight + 26 }
        };
      };
      const exitThreadPath = (): string => {
        const points = getExitGeometry();
        updateStarThreadPath(journey.threadSvg, journey.thread, points.from, points.to);
        return journey.thread.getAttribute('d') ?? '';
      };
      updateExitThread = exitThreadPath;
      const handoffTime = 4.47;

      timeline
        .addLabel('historyHandoff', handoffTime)
        .set(journey.star, {
          xPercent: -50,
          yPercent: -50,
          x: () => getExitGeometry().from.x,
          y: () => getExitGeometry().from.y,
          width: () => getExitGeometry().fromWidth,
          height: () => getExitGeometry().fromHeight,
          rotation: 0,
          autoAlpha: 1
        }, handoffTime)
        .set(journey.thread, {
          strokeDasharray: 1,
          strokeDashoffset: 1,
          autoAlpha: 0
        }, handoffTime)
        .to(ideologyStar, { autoAlpha: 0, duration: .12 }, handoffTime)
        .to(journey.overlay, { autoAlpha: 1, duration: .01 }, handoffTime)
        .to(journey.star, {
          x: () => getExitGeometry().to.x,
          y: () => getExitGeometry().to.y,
          width: 52,
          height: 52,
          autoAlpha: 1,
          duration: .55,
          ease: 'none'
        }, handoffTime + .01)
        .to(journey.thread, {
          strokeDashoffset: 0,
          autoAlpha: .9,
          duration: .55
        }, handoffTime + .01);
    }

    ScrollTrigger.refresh();
    return () => {
      transition.scrollTrigger?.kill();
      timeline.scrollTrigger?.kill();
    };
  });

  return () => media.revert();
}
