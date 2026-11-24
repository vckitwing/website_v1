import { gsap } from 'gsap';
import { registerStarLeg, svgStarBox } from '@shared/story/star-journey-controller';

/**
 * The footer. Its star is where the page's one journey star ends (flying in from the thinkers' progress rail). When the
 * footer arrives the cheetah's line is revealed from the tail to the snarling head, led by a bright blue glint, and the text
 * and social icons rise. Afterwards the cheetah is alive: it breathes slowly, the glint sweeps along its outline every few
 * seconds, and on a fine pointer it leans a little towards the pointer. The idle motion pauses off screen. With reduced
 * motion the footer is simply shown complete (no glint, no breathing, no lean) and the journey star is not flown.
 */
export async function createFooterAnimation(root: HTMLElement): Promise<() => void> {
  const { ScrollTrigger } = await import('gsap/ScrollTrigger');
  gsap.registerPlugin(ScrollTrigger);

  const stage = root.querySelector<HTMLElement>('.ft-stage');
  const footerStar = root.querySelector<SVGSVGElement>('.ft-star');
  const cheetah = root.querySelector<HTMLElement>('.ft-cheetah');
  const art = root.querySelector<HTMLElement>('.ft-art');
  const glint = root.querySelector<HTMLElement>('.ft-glint');
  const rising = Array.from(root.querySelectorAll<HTMLElement>('.ft-brand-text, .ft-tagline, .ft-block, .ft-bar'));
  const icons = Array.from(root.querySelectorAll<HTMLElement>('.ft-social li'));
  if (!stage || !footerStar || !cheetah || !art || !glint) {
    throw new Error('The footer requires its stage, star and artwork.');
  }

  const media = gsap.matchMedia(root);
  media.add('(prefers-reduced-motion: no-preference)', () => {
    gsap.set(art, { clipPath: 'inset(-90px 100% -90px -90px)', opacity: 0.6, y: 14 });
    gsap.set(glint, { '--glint': '-30%' });
    gsap.set(rising, { autoAlpha: 0, y: 24 });
    gsap.set(icons, { autoAlpha: 0, y: 16, scale: 0.8 });

    const idle: gsap.core.Animation[] = [];
    const startIdle = (): void => {
      // breathing: the body swells a hair, from the ground up
      idle.push(gsap.to(art, { scaleY: 1.014, scaleX: 1.004, duration: 2.6, ease: 'sine.inOut', yoyo: true, repeat: -1 }));
      // the glint travels the whole outline, rests, and goes again
      idle.push(
        gsap.fromTo(glint, { '--glint': '-30%' }, { '--glint': '130%', duration: 2.8, ease: 'sine.inOut', repeat: -1, repeatDelay: 3.6 })
      );
    };

    const entrance = gsap.timeline({ paused: true, onComplete: startIdle });
    entrance
      .to(rising, { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.12 }, 0)
      .to(icons, { autoAlpha: 1, y: 0, scale: 1, duration: 0.6, ease: 'back.out(1.8)', stagger: 0.08 }, 0.5)
      // tail (left) to head (right), the way the line would be drawn; the clip is outset so the glow is not cut at the edges
      .to(art, { clipPath: 'inset(-90px -90px -90px -90px)', opacity: 1, y: 0, duration: 2.4, ease: 'power2.inOut' }, 0.2)
      // the glint rides the leading edge of the reveal
      .fromTo(glint, { '--glint': '-30%' }, { '--glint': '130%', duration: 2.4, ease: 'power2.inOut' }, 0.2);

    const enter = ScrollTrigger.create({ trigger: stage, start: 'top 75%', once: true, onEnter: () => entrance.play() });
    const visibility = ScrollTrigger.create({
      trigger: root,
      start: 'top bottom',
      end: 'bottom top',
      onToggle: (self) => idle.forEach((animation) => animation.paused(!self.isActive))
    });

    // a gentle lean towards the pointer (fine pointers only)
    const cleanups: Array<() => void> = [];
    if (window.matchMedia('(pointer: fine)').matches) {
      const x = gsap.quickTo(cheetah, 'x', { duration: 0.9, ease: 'power3.out' });
      const y = gsap.quickTo(cheetah, 'y', { duration: 0.9, ease: 'power3.out' });
      const rotate = gsap.quickTo(cheetah, 'rotation', { duration: 1.1, ease: 'power3.out' });
      const onMove = (event: PointerEvent): void => {
        const bounds = root.getBoundingClientRect();
        const nx = (event.clientX - bounds.left) / bounds.width - 0.5;
        const ny = (event.clientY - bounds.top) / bounds.height - 0.5;
        x(nx * 22);
        y(ny * 10);
        rotate(nx * 1.1);
      };
      const onLeave = (): void => {
        x(0);
        y(0);
        rotate(0);
      };
      root.addEventListener('pointermove', onMove, { passive: true });
      root.addEventListener('pointerleave', onLeave);
      cleanups.push(() => {
        root.removeEventListener('pointermove', onMove);
        root.removeEventListener('pointerleave', onLeave);
      });
    }

    return () => {
      enter.kill();
      visibility.kill();
      entrance.kill();
      idle.splice(0).forEach((animation) => animation.kill());
      cleanups.forEach((cleanup) => cleanup());
      gsap.set([art, glint, cheetah, ...rising, ...icons], { clearProps: 'all' });
    };
  });

  // The journey star's last leg: from the thinkers' rail star, past the conferences, into the footer.
  let removeLeg: (() => void) | undefined;
  let cancelled = false;
  const app = root.closest('vck-root');
  const thinkers = app?.querySelector<HTMLElement>('vck-thinkers-section');
  const railStar = thinkers?.querySelector<SVGSVGElement>('.th-rail-star');
  media.add('(prefers-reduced-motion: no-preference)', () => {
    if (!thinkers || !railStar) return undefined;
    void registerStarLeg(root, {
      id: 'thinkers-to-footer',
      // The thinkers stage is unpinned at (section bottom - one viewport).
      start: () => thinkers.getBoundingClientRect().bottom + window.scrollY - window.innerHeight,
      end: () => {
        const target = footerStar.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.55;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight - 4;
        return Math.min(target, maxScroll);
      },
      from: () => svgStarBox(railStar),
      to: () => svgStarBox(footerStar),
      source: railStar,
      target: footerStar
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
