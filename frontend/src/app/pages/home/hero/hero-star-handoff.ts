import { FLAG_STAR_ARRIVAL_VIEWPORT_RATIO, getFlagStarBounds } from '@shared/story/flag-star-geometry';
import { rectStarBox, registerStarLeg } from '@shared/story/star-journey-controller';

/**
 * Leg 1 of the page's star journey: hero -> the VCK flag. The star leaves the hero's portrait stage when the page starts to
 * scroll and lands on the flag's own star, which is already on the flag (static) when it arrives.
 */
export async function createHeroFlagHandoff(heroAnchor: Element): Promise<() => void> {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {};
  const app = heroAnchor.closest('vck-root');
  const flagStar = app?.querySelector<SVGPolygonElement>('.flag-star');
  if (!flagStar) throw new Error('The hero-to-flag handoff requires the existing VCK flag star.');

  const documentCentre = (element: Element) => {
    const rect = element.getBoundingClientRect();
    return { x: rect.left + rect.width / 2 + window.scrollX, y: rect.top + rect.height / 2 + window.scrollY };
  };
  const sourceSize = (): number => {
    const rect = heroAnchor.getBoundingClientRect();
    return Math.max(50, Math.min(90, rect.width * 0.16));
  };

  return registerStarLeg(heroAnchor, {
    id: 'hero-to-flag',
    // The flight starts once the portrait stage has reached 42% of the viewport height and ends when the flag's star is
    // 68% of the way down it (the same marks as before, now exact because the star follows the scroll directly).
    start: () => Math.max(0, documentCentre(heroAnchor).y - window.innerHeight * 0.42),
    end: () => {
      const bounds = getFlagStarBounds(flagStar);
      return bounds.top + bounds.height / 2 + window.scrollY - window.innerHeight * FLAG_STAR_ARRIVAL_VIEWPORT_RATIO;
    },
    from: () => {
      const rect = heroAnchor.getBoundingClientRect();
      const size = sourceSize();
      return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, width: size * 0.92, height: size * 0.88 };
    },
    to: () => rectStarBox(getFlagStarBounds(flagStar)),
    target: flagStar,
    targetAlwaysVisible: true
  });
}
