import { gsap } from 'gsap';
import { getStarJourneyElements, updateStarThreadPath } from '../../story/star-journey';

type ThinkerFanConditions = {
  isDesktop: boolean;
  isTablet: boolean;
  isMobile: boolean;
  reduceMotion: boolean;
};

type CardPosition = {
  x: number;
  y: number;
  z: number;
  rotationY: number;
  rotationZ: number;
  zIndex: number;
};

export type ThinkerFanAnimation = {
  open: (index: number) => void;
  close: (index: number, onComplete: () => void) => void;
  destroy: () => void;
};

export async function createThinkerFanAnimation(root: HTMLElement): Promise<ThinkerFanAnimation> {
  const { ScrollTrigger } = await import('gsap/ScrollTrigger');
  gsap.registerPlugin(ScrollTrigger);

  const stage = root.querySelector<HTMLElement>('.thinker-stage');
  const cards = Array.from(root.querySelectorAll<HTMLElement>('.thinker-card'));
  const historyHost = root.closest('vck-thinkers-section')?.previousElementSibling;
  const historyTrack = historyHost?.querySelector<HTMLElement>('.history-track');
  const historyMarker = historyHost?.querySelector<HTMLElement>('.history-star-marker');

  if (!stage || cards.length !== 3 || !historyHost || !historyTrack || !historyMarker) {
    throw new Error('The thinker section requires its three cards and the preceding history timeline.');
  }

  const journey = getStarJourneyElements(root);
  const media = gsap.matchMedia(root);
  let positions: CardPosition[] = [];
  let isReducedMotion = false;
  let activeIndex: number | null = null;
  let activeTimeline: gsap.core.Timeline | undefined;
  let fanTimeline: gsap.core.Timeline | undefined;
  let arrivalTimeline: gsap.core.Timeline | undefined;
  let pendingClose: (() => void) | undefined;
  let isDestroying = false;

  const restoreFan = (): void => {
    cards.forEach((card, index) => {
      const position = positions[index];
      gsap.set(card, {
        xPercent: -50,
        yPercent: -50,
        x: position.x,
        y: position.y,
        z: position.z,
        rotationX: 0,
        rotationY: position.rotationY,
        rotationZ: position.rotationZ,
        scale: 1,
        autoAlpha: 1,
        zIndex: position.zIndex,
        transformOrigin: '50% 50%',
        transformStyle: 'preserve-3d'
      });
    });
  };

  const setOpenState = (index: number): void => {
    cards.forEach((card, cardIndex) => {
      if (cardIndex === index) {
        gsap.set(card, {
          x: 0,
          y: -4,
          z: isReducedMotion ? 0 : 90,
          rotationX: 0,
          rotationY: 180,
          rotationZ: 0,
          scale: 1,
          autoAlpha: 1,
          zIndex: 20
        });
      } else {
        gsap.set(card, {
          y: positions[cardIndex].y + 18,
          z: positions[cardIndex].z - 75,
          scale: .86,
          autoAlpha: .2
        });
      }
    });
  };

  media.add({
    isDesktop: '(min-width: 1025px)',
    isTablet: '(min-width: 601px) and (max-width: 1024px)',
    isMobile: '(max-width: 600px)',
    reduceMotion: '(prefers-reduced-motion: reduce)'
  }, (context) => {
    const { isDesktop, isTablet, isMobile, reduceMotion } = context.conditions as ThinkerFanConditions;
    isReducedMotion = reduceMotion;

    const updatePositions = (): void => {
      const stageWidth = stage.clientWidth;
      const cardWidth = cards[0].offsetWidth;
      const spacing = isMobile
        ? Math.min(cardWidth * .4, stageWidth * .25)
        : isTablet
          ? Math.min(185, stageWidth * .24)
          : Math.min(215, stageWidth * .225);
      const sideY = isMobile ? -8 : -10;
      const sideRotation = isMobile ? 8 : 10;

      positions = [
        { x: 0, y: 0, z: 8, rotationY: 0, rotationZ: 0, zIndex: 3 },
        { x: -spacing, y: sideY, z: -42, rotationY: sideRotation, rotationZ: -sideRotation * .72, zIndex: 1 },
        { x: spacing, y: sideY, z: -42, rotationY: -sideRotation, rotationZ: sideRotation * .72, zIndex: 2 }
      ];
    };

    updatePositions();
    gsap.set(journey.overlay, { autoAlpha: 0 });
    gsap.set(journey.star, { xPercent: -50, yPercent: -50, autoAlpha: 0 });
    gsap.set(journey.thread, { strokeDasharray: 1, strokeDashoffset: 1, autoAlpha: 0 });

    if (reduceMotion) {
      restoreFan();
      gsap.set(historyMarker, { autoAlpha: 1 });
    } else {
      cards.forEach((card, index) => {
        const position = positions[index];
        gsap.set(card, {
          xPercent: -50,
          yPercent: -50,
          x: position.x * .12,
          y: position.y * .12,
          z: position.z * .12,
          rotationY: position.rotationY * .12,
          rotationZ: position.rotationZ * .12,
          scale: .94,
          autoAlpha: 1,
          zIndex: position.zIndex,
          transformOrigin: '50% 50%',
          transformStyle: 'preserve-3d'
        });
      });

      fanTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: stage,
          start: 'top 88%',
          end: 'top 32%',
          scrub: .45,
          invalidateOnRefresh: true
        }
      });
      cards.forEach((card, index) => {
        fanTimeline?.to(card, {
          x: () => positions[index].x,
          y: () => positions[index].y,
          z: () => positions[index].z,
          rotationY: () => positions[index].rotationY,
          rotationZ: () => positions[index].rotationZ,
          scale: 1,
          duration: 1,
          ease: 'power2.out'
        }, index * .045);
      });

      const getArrivalGeometry = () => {
        const historyBounds = historyHost.getBoundingClientRect();
        const startScroll = historyBounds.bottom + window.scrollY - window.innerHeight;
        const trackBounds = historyTrack.getBoundingClientRect();
        const stageBounds = stage.getBoundingClientRect();
        const historyX = isMobile ? .07 : .5;
        const fromPage = {
          x: trackBounds.left + window.scrollX + historyTrack.clientWidth * historyX,
          y: trackBounds.top + window.scrollY + historyTrack.clientHeight * .95
        };
        const targetPage = {
          x: stageBounds.left + window.scrollX + stageBounds.width / 2,
          y: stageBounds.top + window.scrollY + stageBounds.height / 2
        };

        return {
          from: { x: fromPage.x - window.scrollX, y: fromPage.y - startScroll },
          to: { x: targetPage.x - window.scrollX, y: window.innerHeight / 2 },
          targetSize: Math.min(56, Math.max(42, stageBounds.width * .055))
        };
      };
      const arrivalThreadPath = (): string => {
        const points = getArrivalGeometry();
        updateStarThreadPath(journey.threadSvg, journey.thread, points.from, points.to);
        return journey.thread.getAttribute('d') ?? '';
      };

      arrivalTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: historyHost,
          start: 'bottom bottom',
          endTrigger: stage,
          end: 'center center',
          scrub: .45,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (self.isActive) arrivalThreadPath();
          }
        }
      });
      arrivalTimeline
        .set(journey.thread, {
          strokeDasharray: 1,
          strokeDashoffset: 1,
          autoAlpha: 0,
          immediateRender: false
        }, 0)
        .fromTo(journey.star, {
          xPercent: -50,
          yPercent: -50,
          x: () => getArrivalGeometry().from.x,
          y: () => getArrivalGeometry().from.y,
          width: 52,
          height: 52,
          rotation: -18
        }, {
          x: () => getArrivalGeometry().to.x,
          y: () => getArrivalGeometry().to.y,
          width: () => getArrivalGeometry().targetSize,
          height: () => getArrivalGeometry().targetSize,
          rotation: 0,
          duration: 1,
          ease: 'none',
          immediateRender: false
        }, 0)
        .fromTo(journey.star, { autoAlpha: 0 }, {
          autoAlpha: 1,
          duration: .16,
          ease: 'none',
          immediateRender: false
        }, 0)
        .fromTo(journey.thread, { strokeDashoffset: 1, autoAlpha: 0 }, {
          strokeDashoffset: 0,
          autoAlpha: .88,
          duration: 1,
          immediateRender: false
        }, 0)
        .to(journey.overlay, { autoAlpha: 1, duration: .01 }, 0)
        .to(journey.overlay, { autoAlpha: 0, duration: .04 }, .96);

      arrivalTimeline.eventCallback('onUpdate', () => {
        if (arrivalTimeline?.scrollTrigger?.isActive) arrivalThreadPath();
        const progress = arrivalTimeline?.progress() ?? 0;
        gsap.set(historyMarker, { autoAlpha: Math.max(0, 1 - progress / .16) });
      });
    }

    const onResize = (): void => {
      updatePositions();
      ScrollTrigger.refresh();
    };
    window.addEventListener('resize', onResize);

    if (activeIndex !== null) setOpenState(activeIndex);

    return () => {
      window.removeEventListener('resize', onResize);
      fanTimeline?.scrollTrigger?.kill();
      arrivalTimeline?.scrollTrigger?.kill();
      activeTimeline?.kill();
      activeTimeline = undefined;
      if (!isDestroying && pendingClose) {
        const completeClose = pendingClose;
        pendingClose = undefined;
        completeClose();
      }
      gsap.set(journey.overlay, { autoAlpha: 0 });
    };
  });

  return {
    open(index: number): void {
      if (index < 0 || index >= cards.length) return;

      fanTimeline?.scrollTrigger?.disable(false);
      arrivalTimeline?.scrollTrigger?.disable(false);
      fanTimeline?.progress(1);
      gsap.set(journey.overlay, { autoAlpha: 0 });
      if (!isReducedMotion) gsap.set(historyMarker, { autoAlpha: 0 });
      activeTimeline?.kill();
      activeIndex = index;
      const selected = cards[index];
      const others = cards.filter((_, cardIndex) => cardIndex !== index);

      if (isReducedMotion) {
        setOpenState(index);
        return;
      }

      const timeline = gsap.timeline({ defaults: { ease: 'power3.inOut' } });
      activeTimeline = timeline;
      timeline.to(others, {
        y: '+=18',
        z: '-=75',
        scale: .86,
        autoAlpha: .2,
        duration: .48
      }, 0);
      timeline.to(selected, {
        x: 0,
        y: -4,
        z: 90,
        rotationX: 0,
        rotationY: 0,
        rotationZ: 0,
        scale: 1.035,
        zIndex: 20,
        duration: .62
      }, 0);
      timeline.to(selected, {
        rotationY: 180,
        scale: 1,
        duration: .72,
        ease: 'power2.inOut'
      }, .3);
    },

    close(index: number, onComplete: () => void): void {
      if (activeIndex !== index) {
        onComplete();
        return;
      }

      activeIndex = null;
      if (isReducedMotion) {
        activeTimeline?.kill();
        activeTimeline = undefined;
        restoreFan();
        fanTimeline?.scrollTrigger?.enable(false, false);
        arrivalTimeline?.scrollTrigger?.enable(false, false);
        ScrollTrigger.update();
        onComplete();
        return;
      }

      if (activeTimeline) {
        const timeline = activeTimeline;
        pendingClose = onComplete;
        timeline.eventCallback('onReverseComplete', () => {
          if (activeTimeline === timeline) activeTimeline = undefined;
          if (pendingClose === onComplete) {
            pendingClose = undefined;
            fanTimeline?.scrollTrigger?.enable(false, false);
            arrivalTimeline?.scrollTrigger?.enable(false, false);
            ScrollTrigger.update();
            onComplete();
          }
        });
        timeline.reverse();
        return;
      }

      restoreFan();
      fanTimeline?.scrollTrigger?.enable(false, false);
      arrivalTimeline?.scrollTrigger?.enable(false, false);
      ScrollTrigger.update();
      onComplete();
    },

    destroy(): void {
      isDestroying = true;
      pendingClose = undefined;
      activeTimeline?.kill();
      media.revert();
      activeTimeline = undefined;
    }
  };
}
