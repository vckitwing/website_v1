import { gsap } from 'gsap';

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

export function createThinkerFanAnimation(root: HTMLElement): ThinkerFanAnimation {
  const stage = root.querySelector<HTMLElement>('.thinker-stage');
  const cards = Array.from(root.querySelectorAll<HTMLElement>('.thinker-card'));

  if (!stage || cards.length !== 3) {
    throw new Error('The thinker section requires its card stage and exactly three thinker cards.');
  }

  const media = gsap.matchMedia(root);
  let positions: CardPosition[] = [];
  let isReducedMotion = false;
  let activeIndex: number | null = null;
  let activeTimeline: gsap.core.Timeline | undefined;
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

    const stageWidth = stage.clientWidth;
    const cardWidth = cards[0].getBoundingClientRect().width;
    const spacing = isMobile
      ? Math.min(cardWidth * .4, stageWidth * .25)
      : isTablet
        ? Math.min(185, stageWidth * .24)
        : Math.min(215, stageWidth * .225);
    const sideY = isMobile ? -8 : -10;
    const sideRotation = isMobile ? 8 : 10;

    positions = [
      { x: -spacing, y: sideY, z: -42, rotationY: sideRotation, rotationZ: -sideRotation * .72, zIndex: 1 },
      { x: 0, y: 0, z: 8, rotationY: 0, rotationZ: 0, zIndex: 3 },
      { x: spacing, y: sideY, z: -42, rotationY: -sideRotation, rotationZ: sideRotation * .72, zIndex: 2 }
    ];

    restoreFan();
    if (activeIndex !== null) setOpenState(activeIndex);

    return () => {
      activeTimeline?.kill();
      activeTimeline = undefined;
      gsap.set(cards, { clearProps: 'transform,opacity,visibility,zIndex' });
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
            onComplete();
          }
        });
        timeline.reverse();
        return;
      }

      restoreFan();
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
