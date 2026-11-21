export const FLAG_STAR_ARRIVAL_VIEWPORT_RATIO = 0.68;

export function getFlagStarBounds(flagStar: SVGPolygonElement): DOMRect {
  const svg = flagStar.ownerSVGElement;
  if (!svg) throw new Error('The existing VCK flag star is missing its SVG container.');
  const bounds = svg.getBoundingClientRect();
  const viewBox = svg.viewBox.baseVal;
  const geometry = flagStar.getBBox();
  const scaleX = bounds.width / Math.max(viewBox.width, 1);
  const scaleY = bounds.height / Math.max(viewBox.height, 1);
  return new DOMRect(
    bounds.left + (geometry.x - viewBox.x) * scaleX,
    bounds.top + (geometry.y - viewBox.y) * scaleY,
    geometry.width * scaleX,
    geometry.height * scaleY
  );
}

export function getFlagStarArrivalScroll(flagStar: SVGPolygonElement): number {
  const bounds = getFlagStarBounds(flagStar);
  return bounds.top + bounds.height / 2 + window.scrollY - window.innerHeight * FLAG_STAR_ARRIVAL_VIEWPORT_RATIO;
}
