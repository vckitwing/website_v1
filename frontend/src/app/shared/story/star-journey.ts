export type StarJourneyElements = {
  overlay: HTMLElement;
  star: SVGSVGElement;
};

/** The page's single flying star (see star-journey-controller.ts). */
export function getStarJourneyElements(root: Element): StarJourneyElements {
  const app = root.closest('vck-root');
  const overlay = app?.querySelector<HTMLElement>('.story-star-journey');
  const star = overlay?.querySelector<SVGSVGElement>('.story-star-journey-shape');

  if (!overlay || !star) {
    throw new Error('The VCK story requires its shared flying-star overlay.');
  }

  return { overlay, star };
}
