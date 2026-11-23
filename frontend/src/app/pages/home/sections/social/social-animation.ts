import { gsap } from 'gsap';

/**
 * The social links' entrance and idle motion. The tiles burst out of the star in the middle of the stage, one after
 * another, then float very gently, each on its own rhythm. The float pauses when the section is off screen. With reduced
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
    gsap.set(star, { scale: 0.5, opacity: 0 });

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
      .to(star, { scale: 1, opacity: 1, duration: 0.9, ease: 'power3.out' }, 0)
      .to(items, { x: 0, y: 0, scale: 1, autoAlpha: 1, duration: 0.95, ease: 'back.out(1.5)', stagger: 0.09 }, 0.2);

    const enter = ScrollTrigger.create({ trigger: stage, start: 'top 80%', once: true, onEnter: () => entrance.play() });
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
      gsap.set([...items, star], { clearProps: 'all' });
    };
  });

  return () => media.revert();
}
