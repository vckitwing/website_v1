import { gsap } from 'gsap';

/**
 * The contact page's entrance: the heading, the two cards and the form rise into place one after another when the page opens.
 * With reduced motion nothing moves and everything is simply shown.
 */
export async function createContactAnimation(root: HTMLElement): Promise<() => void> {
  const items = Array.from(root.querySelectorAll<HTMLElement>('.ct-reveal'));
  if (!items.length) throw new Error('The contact page requires its revealable blocks.');

  const media = gsap.matchMedia(root);
  media.add('(prefers-reduced-motion: no-preference)', () => {
    gsap.fromTo(items, { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.12, delay: 0.1, clearProps: 'transform' });
    return () => gsap.set(items, { clearProps: 'all' });
  });
  return () => media.revert();
}
