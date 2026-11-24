import { gsap } from 'gsap';
import { registerStarLeg, svgStarBox } from '@shared/story/star-journey-controller';

/**
 * The social links' entrance and idle motion. The page's journey star flies in from the history timeline and lands in the
 * middle of the stage (its position is owned by the star journey controller, so this file never touches its opacity); when it
 * has landed the tiles burst out of it, one after another, then float very gently, each on its own rhythm. The float pauses when the section is off screen. With reduced
 * motion nothing moves (the hover / press effects are plain colour changes, handled in CSS).
 */
export async function createSocialAnimation(root: HTMLElement): Promise<() => void> {
  const { ScrollTrigger } = await import('gsap/ScrollTrigger');
  gsap.registerPlugin(ScrollTrigger);

  const stage = root.querySelector<HTMLElement>('.soc-stage');
  const star = root.querySelector<SVGSVGElement>('.soc-star');
  const items = Array.from(root.querySelectorAll<HTMLElement>('.soc-item'));
  if (!stage || !star || !items.length) throw new Error('The social section requires its stage, star and tiles.');

  const media = gsap.matchMedia(root);
  media.add('(prefers-reduced-motion: no-preference)', () => {
    const floats: gsap.core.Tween[] = [];
    const stageBounds = stage.getBoundingClientRect();
    const centre = { x: stageBounds.left + stageBounds.width / 2, y: stageBounds.top + stageBounds.height / 2 };

    // Before the entrance: every tile sits hidden on the star.
    items.forEach((item) => {
      const rect = item.getBoundingClientRect();
      gsap.set(item, {
        x: centre.x - (rect.left + rect.width / 2),
        y: centre.y - (rect.top + rect.height / 2),
        scale: 0.35,
        autoAlpha: 0
      });
    });

    const startFloat = (): void => {
      items.forEach((item, index) => {
        floats.push(
          gsap.to(item, {
            y: index % 2 === 0 ? -7 : 7,
            duration: 2.6 + index * 0.45,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1,
            delay: index * 0.3
          })
        );
      });
    };

    const entrance = gsap.timeline({ paused: true, onComplete: startFloat });
    entrance
      .to(items, { x: 0, y: 0, scale: 1, autoAlpha: 1, duration: 0.95, ease: 'back.out(1.5)', stagger: 0.09 }, 0);

    const enter = ScrollTrigger.create({ trigger: stage, start: 'center 52%', once: true, onEnter: () => entrance.play() });
    const visibility = ScrollTrigger.create({
      trigger: root,
      start: 'top bottom',
      end: 'bottom top',
      onToggle: (self) => floats.forEach((tween) => tween.paused(!self.isActive))
    });

    return () => {
      enter.kill();
      visibility.kill();
      entrance.kill();
      floats.splice(0).forEach((tween) => tween.kill());
      gsap.set(items, { clearProps: 'all' });
    };
  });

  // The journey star: history timeline marker -> this section's star (it lands when the star is half way up the screen).
  const historyMarker = root.closest('vck-root')?.querySelector<HTMLElement>('vck-history-section .history-star-marker');
  const historyHost = root.closest('vck-root')?.querySelector<HTMLElement>('vck-history-section');
  let removeLeg: (() => void) | undefined;
  let cancelled = false;
  media.add('(prefers-reduced-motion: no-preference)', () => {
    if (!historyMarker || !historyHost) return undefined;
    void registerStarLeg(root, {
      id: 'history-to-social',
      start: () => historyHost.getBoundingClientRect().bottom + window.scrollY - window.innerHeight,
      end: () => svgStarBox(star).y + window.scrollY - window.innerHeight * 0.5,
      from: () => svgStarBox(historyMarker.querySelector('svg') ?? historyMarker),
      to: () => svgStarBox(star),
      source: historyMarker,
      target: star
    }).then((remove) => {
      if (cancelled) remove();
      else removeLeg = remove;
    });
    return () => {
      removeLeg?.();
      removeLeg = undefined;
    };
  });

  return () => {
    cancelled = true;
    removeLeg?.();
    media.revert();
  };
}
