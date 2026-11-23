import { gsap } from 'gsap';
import { registerStarLeg, svgStarBox } from '@shared/story/star-journey-controller';

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

  const media = gsap.matchMedia(root);
  let positions: CardPosition[] = [];
  let isReducedMotion = false;
  let activeIndex: number | null = null;
  let activeTimeline: gsap.core.Timeline | undefined;
  let fanTimeline: gsap.core.Timeline | undefined;
  let removeArrival: (() => void) | undefined;
  let arrivalPending = false;
  let startArrival: () => void = () => {};
  const stopArrival = (): void => {
    removeArrival?.();
    removeArrival = undefined;
  };
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

      // Last leg of the page's star journey: the history timeline's star travels on to the thinkers.
      startArrival = (): void => {
        if (removeArrival || arrivalPending || isDestroying) return;
        arrivalPending = true;
        void registerStarLeg(root, {
          id: 'history-to-thinkers',
          start: () => historyHost.getBoundingClientRect().bottom + window.scrollY - window.innerHeight,
          end: () => {
            const bounds = stage.getBoundingClientRect();
            return bounds.top + window.scrollY + bounds.height / 2 - window.innerHeight / 2;
          },
          from: () => svgStarBox(historyMarker.querySelector('svg') ?? historyMarker),
          to: () => {
            const bounds = stage.getBoundingClientRect();
            const size = Math.min(56, Math.max(42, bounds.width * .055));
            return { x: bounds.left + bounds.width / 2, y: window.innerHeight / 2, width: size * .92, height: size * .88 };
          },
          source: historyMarker
        }).then((remove) => {
          arrivalPending = false;
          if (isDestroying || removeArrival) remove();
          else removeArrival = remove;
        });
      };
      startArrival();
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
      stopArrival();
      activeTimeline?.kill();
      activeTimeline = undefined;
      if (!isDestroying && pendingClose) {
        const completeClose = pendingClose;
        pendingClose = undefined;
        completeClose();
      }
    };
  });

  return {
    open(index: number): void {
      if (index < 0 || index >= cards.length) return;

      fanTimeline?.scrollTrigger?.disable(false);
      stopArrival();
      fanTimeline?.progress(1);
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
        startArrival();
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
            startArrival();
            ScrollTrigger.update();
            onComplete();
          }
        });
        timeline.reverse();
        return;
      }

      restoreFan();
      fanTimeline?.scrollTrigger?.enable(false, false);
      startArrival();
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
