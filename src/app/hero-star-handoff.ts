import { gsap } from 'gsap';
import { FLAG_STAR_ARRIVAL_VIEWPORT_RATIO, getFlagStarArrivalScroll, getFlagStarBounds } from './story/flag-star-geometry';
import { getStarJourneyElements } from './story/star-journey';

export async function createHeroFlagHandoff(
  heroAnchor: HTMLElement,
  onStarProgress: (progress: number) => void
): Promise<() => void> {
  const { ScrollTrigger } = await import('gsap/ScrollTrigger');
  gsap.registerPlugin(ScrollTrigger);

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {};
  const desktop = window.matchMedia('(min-width: 1101px)').matches;
  const app = heroAnchor.closest('vck-root');
  const flagStar = app?.querySelector<SVGPolygonElement>('.flag-star');
  if (!flagStar) throw new Error('The hero-to-flag handoff requires the existing VCK flag star.');
  const flagSection = flagStar.closest<HTMLElement>('.flag-section');
  if (!flagSection) throw new Error('The existing VCK flag star is missing its flag section.');

  const journey = getStarJourneyElements(heroAnchor);
  const setProgress = (progress: number): void => {
    const source = heroAnchor.getBoundingClientRect();
    const target = getFlagStarBounds(flagStar);
    const sourceDocumentX = source.left + source.width / 2 + window.scrollX;
    const targetDocumentX = target.left + target.width / 2 + window.scrollX;
    const targetDocumentY = target.top + target.height / 2 + window.scrollY;
    const startY = window.innerHeight * 0.42;
    const targetY = window.innerHeight * FLAG_STAR_ARRIVAL_VIEWPORT_RATIO;
    const sourceSize = Math.max(50, Math.min(90, source.width * 0.16));
    const targetWidth = Math.max(target.width, 1);
    const targetHeight = Math.max(target.height, 1);
    const size = sourceSize + (Math.max(targetWidth, targetHeight) - sourceSize) * progress;
    const x = sourceDocumentX + (targetDocumentX - sourceDocumentX) * progress - window.scrollX;
    const y = startY + (targetY - startY) * progress;
    const edgeFade = Math.min(1, progress / 0.08, (1 - progress) / 0.1);

    gsap.set(journey.star, {
      x,
      y,
      width: size,
      height: size,
      xPercent: -50,
      yPercent: -50,
      autoAlpha: Math.max(0, edgeFade)
    });
    gsap.set(journey.overlay, { autoAlpha: edgeFade > 0 ? 1 : 0 });
    flagSection.classList.toggle('hero-star-covered', progress >= 0.08 && progress < 0.92);
    if (desktop) {
      gsap.set(flagStar, progress >= 0.92
        ? { x: 0, y: 0, scale: 1, rotation: 0, autoAlpha: 1 }
        : { x: 30, y: -16, scale: 0, rotation: -32, autoAlpha: 0 });
    }
    onStarProgress(Math.min(1, progress / 0.08));
  };

  const getScrollBounds = () => {
    const source = heroAnchor.getBoundingClientRect();
    const sourceDocumentY = source.top + source.height / 2 + window.scrollY;
    return {
      start: sourceDocumentY - window.innerHeight * 0.42,
      end: getFlagStarArrivalScroll(flagStar)
    };
  };

  gsap.set(journey.overlay, { autoAlpha: 0 });
  gsap.set(journey.star, { xPercent: -50, yPercent: -50, autoAlpha: 0 });
  onStarProgress(0);

  const trigger = ScrollTrigger.create({
    trigger: heroAnchor,
    start: () => getScrollBounds().start,
    end: () => Math.max(getScrollBounds().end, getScrollBounds().start + 1),
    scrub: 0.45,
    invalidateOnRefresh: true,
    onUpdate: (self) => setProgress(self.progress),
    onLeave: () => setProgress(1),
    onLeaveBack: () => {
      gsap.set(journey.overlay, { autoAlpha: 0 });
      gsap.set(journey.star, { autoAlpha: 0 });
      flagSection.classList.remove('hero-star-covered');
      if (desktop) gsap.set(flagStar, { x: 30, y: -16, scale: 0, rotation: -32, autoAlpha: 0 });
      onStarProgress(0);
    }
  });

  return () => {
    trigger.kill();
    gsap.set(journey.overlay, { autoAlpha: 0 });
    gsap.set(journey.star, { autoAlpha: 0 });
    flagSection.classList.remove('hero-star-covered');
    if (desktop) gsap.set(flagStar, { x: 30, y: -16, scale: 0, rotation: -32, autoAlpha: 0 });
    onStarProgress(0);
  };
}
