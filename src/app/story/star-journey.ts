export type JourneyPoint = {
  x: number;
  y: number;
};

export type StarJourneyElements = {
  overlay: HTMLElement;
  star: SVGSVGElement;
  threadSvg: SVGSVGElement;
  thread: SVGPathElement;
};

export function getStarJourneyElements(root: HTMLElement): StarJourneyElements {
  const app = root.closest('vck-root');
  const overlay = app?.querySelector<HTMLElement>('.story-star-journey');
  const star = overlay?.querySelector<SVGSVGElement>('.story-star-journey-shape');
  const threadSvg = overlay?.querySelector<SVGSVGElement>('.story-star-journey-thread');
  const thread = threadSvg?.querySelector<SVGPathElement>('.story-star-thread-path');

  if (!overlay || !star || !threadSvg || !thread) {
    throw new Error('The VCK story requires its shared star-and-thread overlay.');
  }

  return { overlay, star, threadSvg, thread };
}

export function updateStarThreadPath(
  threadSvg: SVGSVGElement,
  thread: SVGPathElement,
  from: JourneyPoint,
  to: JourneyPoint
): void {
  const width = Math.max(1, window.innerWidth);
  const height = Math.max(1, window.innerHeight);

  threadSvg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  thread.setAttribute('d', `M ${from.x} ${from.y} L ${to.x} ${to.y}`);
}
