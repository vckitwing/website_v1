import { gsap } from 'gsap';
import { registerStarLeg, svgStarBox } from '@shared/story/star-journey-controller';

export interface ConferencesAnimation {
  /** The user's pause switch. */
  setPaused(paused: boolean): void;
  dispose(): void;
}

/** Drift speed of each row in px per second (the rows run at slightly different speeds, row 2 the other way). */
const ROW_SPEED = [24, 19, 29] as const;

/**
 * The conferences "spread rows" motion: a single card sits in the middle of the stage, then the cards fan out sideways,
 * split into three rows, and the rows drift on in alternating directions. Plays once when the section comes into view;
 * the drift pauses when the section is off screen, while the pointer rests on it, and from the user's switch.
 */
export async function createConferencesAnimation(root: HTMLElement): Promise<ConferencesAnimation> {
  const { ScrollTrigger } = await import('gsap/ScrollTrigger');
  gsap.registerPlugin(ScrollTrigger);

  const stage = root.querySelector<HTMLElement>('.conf-stage');
  const rows = Array.from(root.querySelectorAll<HTMLElement>('.conf-row'));
  const tracks = rows.map((row) => row.querySelector<HTMLElement>('.conf-track'));
  if (!stage || rows.length !== 3 || tracks.some((track) => !track)) {
    throw new Error('The conferences section requires its stage and three rows.');
  }

  let userPaused = false;
  let hoverPaused = false;
  let inView = false;
  const marquee: gsap.core.Tween[] = [];
  const applyPause = (): void => {
    const paused = userPaused || hoverPaused || !inView;
    marquee.forEach((tween) => {
      gsap.to(tween, { timeScale: paused ? 0 : 1, duration: 0.5, ease: 'power1.out', overwrite: true });
    });
  };

  const media = gsap.matchMedia(root);
  media.add('(prefers-reduced-motion: reduce)', () => {
    // No motion at all: one copy of each row, scrolled by hand.
    root.classList.add('is-static');
    return () => root.classList.remove('is-static');
  });
  media.add('(prefers-reduced-motion: no-preference)', () => {
    const tiles = rows.map((row) => Array.from(row.querySelectorAll<HTMLElement>('.conf-tile')));
    const stageBounds = stage.getBoundingClientRect();
    const centre = { x: stageBounds.left + stageBounds.width / 2, y: stageBounds.top + stageBounds.height / 2 };

    // Only the tiles on screen take part in the intro; the rest are off to the sides and simply drift in later.
    const taking = tiles.flatMap((rowTiles, row) =>
      rowTiles.flatMap((tile) => {
        const rect = tile.getBoundingClientRect();
        if (rect.right < -40 || rect.left > window.innerWidth + 40) return [];
        const dx = centre.x - (rect.left + rect.width / 2);
        const dy = centre.y - (rect.top + rect.height / 2);
        return [{ tile, row, dx, dy, distance: Math.hypot(dx, dy * 1.4) }];
      })
    );
    if (!taking.length) return undefined;
    const hero = taking.reduce((nearest, item) => (item.distance < nearest.distance ? item : nearest));
    const farthest = Math.max(...taking.map((item) => item.distance), 1);

    // Before the intro: everything is stacked on one card in the middle of the stage.
    taking.forEach((item) => {
      gsap.set(item.tile, item === hero
        ? { x: item.dx, y: item.dy, zIndex: 5 }
        : { x: item.dx, y: item.dy, scale: 0.92, autoAlpha: 0 });
    });

    const startDrift = (): void => {
      tracks.forEach((track, index) => {
        if (!track) return;
        const oneCopy = track.scrollWidth / 3; // the track holds three identical copies
        const duration = oneCopy / ROW_SPEED[index]!;
        const leftward = index !== 1;
        marquee.push(
          gsap.fromTo(track, { xPercent: leftward ? 0 : -100 / 3 }, {
            xPercent: leftward ? -100 / 3 : 0,
            duration,
            ease: 'none',
            repeat: -1
          })
        );
      });
      applyPause();
    };

    const intro = gsap.timeline({ paused: true, onComplete: startDrift });
    intro.to(hero.tile, { x: 0, y: 0, duration: 0.7, ease: 'power3.out' }, 0);
    taking.forEach((item) => {
      if (item === hero) return;
      const spread = item.distance / farthest; // 0 next to the middle .. 1 at the far edges
      // 1) fan out sideways from the middle, 2) the outer rows slide into place.
      intro
        .to(item.tile, { autoAlpha: 1, duration: 0.4, ease: 'power1.out' }, spread * 0.45)
        .to(item.tile, { x: 0, scale: 1, duration: 0.9, ease: 'power3.out' }, spread * 0.45)
        .to(item.tile, { y: 0, duration: 0.8, ease: 'power3.inOut' }, 0.35 + (item.row === 1 ? 0 : 0.12) + spread * 0.25);
    });

    const enter = ScrollTrigger.create({
      trigger: stage,
      start: 'top 78%',
      once: true,
      onEnter: () => {
        intro.play();
      }
    });
    const visibility = ScrollTrigger.create({
      trigger: root,
      start: 'top bottom',
      end: 'bottom top',
      onToggle: (self) => {
        inView = self.isActive;
        applyPause();
      }
    });

    const onEnter = (): void => {
      hoverPaused = true;
      applyPause();
    };
    const onLeave = (): void => {
      hoverPaused = false;
      applyPause();
    };
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (finePointer) {
      stage.addEventListener('pointerenter', onEnter);
      stage.addEventListener('pointerleave', onLeave);
    }

    return () => {
      enter.kill();
      visibility.kill();
      intro.kill();
      marquee.splice(0).forEach((tween) => tween.kill());
      stage.removeEventListener('pointerenter', onEnter);
      stage.removeEventListener('pointerleave', onLeave);
      gsap.set(tracks, { clearProps: 'transform' });
      gsap.set(tiles.flat(), { clearProps: 'transform,opacity,visibility,zIndex' });
    };
  });

  // The journey star stops here: thought leaders (rail star) -> this section's star -> the footer's star.
  const confStar = root.querySelector<SVGSVGElement>('.conf-star');
  const app = root.closest('vck-root');
  const thinkers = app?.querySelector<HTMLElement>('vck-thinkers-section');
  const railStar = thinkers?.querySelector<SVGSVGElement>('.th-rail-star');
  const footerStar = app?.querySelector<SVGSVGElement>('vck-footer-section .ft-star');
  const removeLegs: Array<() => void> = [];
  let legsCancelled = false;
  media.add('(prefers-reduced-motion: no-preference)', () => {
    if (!confStar || !thinkers || !railStar || !footerStar) return undefined;
    const confCentre = (): number => svgStarBox(confStar).y + window.scrollY;
    const keep = (promise: Promise<() => void>): void => {
      void promise.then((remove) => {
        if (legsCancelled) remove();
        else removeLegs.push(remove);
      });
    };
    keep(
      registerStarLeg(root, {
        id: 'thinkers-to-conferences',
        // from when the thinkers stage unpins (section bottom - one viewport) until this star is half way up the screen
        start: () => thinkers.getBoundingClientRect().bottom + window.scrollY - window.innerHeight,
        end: () => confCentre() - window.innerHeight * 0.5,
        from: () => svgStarBox(railStar),
        to: () => svgStarBox(confStar),
        source: railStar,
        target: confStar
      })
    );
    keep(
      registerStarLeg(root, {
        id: 'conferences-to-footer',
        // leaves a moment after it has landed, and arrives when the footer's star is ~55% down the screen
        start: () => confCentre() - window.innerHeight * 0.38,
        end: () => {
          const target = footerStar.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.55;
          return Math.min(target, document.documentElement.scrollHeight - window.innerHeight - 4);
        },
        from: () => svgStarBox(confStar),
        to: () => svgStarBox(footerStar),
        source: confStar,
        target: footerStar
      })
    );
    return () => {
      removeLegs.splice(0).forEach((remove) => remove());
    };
  });

  return {
    setPaused(paused: boolean): void {
      userPaused = paused;
      applyPause();
    },
    dispose(): void {
      legsCancelled = true;
      removeLegs.splice(0).forEach((remove) => remove());
      media.revert();
    }
  };
}
