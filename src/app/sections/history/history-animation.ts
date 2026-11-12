import { gsap } from 'gsap';
import { getStarJourneyElements, updateStarThreadPath } from '../../story/star-journey';

type HistoryAnimationConditions = {
  isDesktop: boolean;
  isMobile: boolean;
  reduceMotion: boolean;
};

export async function createHistoryAnimation(
  root: HTMLElement,
  milestoneCount: number,
  onActiveChange: (index: number) => void
): Promise<() => void> {
  const { ScrollTrigger } = await import('gsap/ScrollTrigger');
  gsap.registerPlugin(ScrollTrigger);

  const track = root.querySelector<HTMLElement>('.history-track');
  const timeline = root.querySelector<SVGSVGElement>('.history-timeline');
  const base = root.querySelector<SVGPathElement>('.history-path-base');
  const trail = root.querySelector<SVGPathElement>('.history-path-trail');
  const marker = root.querySelector<HTMLElement>('.history-star-marker');
  const cards = Array.from(root.querySelectorAll<HTMLElement>('.history-card'));
  const source = root.closest('vck-history-section')?.previousElementSibling?.querySelector<SVGSVGElement>('.ideology-star');
  const journey = getStarJourneyElements(root);

  if (!track || !timeline || !base || !trail || !marker || !source || cards.length !== milestoneCount || milestoneCount < 2) {
    throw new Error('The history section requires its timeline, milestone cards, and the preceding ideology star.');
  }

  const star = source.cloneNode(true) as SVGSVGElement;
  star.setAttribute('aria-hidden', 'true');
  star.removeAttribute('role');
  star.removeAttribute('aria-label');
  star.removeAttribute('width');
  star.removeAttribute('height');
  star.style.width = '100%';
  star.style.height = '100%';
  star.style.display = 'block';
  star.style.removeProperty('opacity');
  star.style.removeProperty('visibility');
  star.style.removeProperty('transform');
  star.querySelectorAll('[id]').forEach((element) => {
    element.id = `${element.id}-history`;
  });
  star.querySelectorAll<SVGGElement>('.star-point').forEach((point) => {
    point.classList.remove('is-active');
    point.removeAttribute('role');
    point.removeAttribute('tabindex');
    point.removeAttribute('aria-label');
    point.removeAttribute('aria-pressed');
  });
  star.querySelectorAll<SVGElement>('[style]').forEach((element) => element.removeAttribute('style'));
  marker.replaceChildren(star);
  const starFaces = Array.from(star.querySelectorAll<SVGPathElement>('.star-point-face'));
  if (starFaces.length !== 5) throw new Error('The history marker must reuse the existing five-point ideology star.');
  starFaces.forEach((face) => face.style.setProperty('transition', 'none'));

  const media = gsap.matchMedia(root);
  media.add({
    isDesktop: '(min-width: 761px)',
    isMobile: '(max-width: 760px)',
    reduceMotion: '(prefers-reduced-motion: reduce)'
  }, (context) => {
    const { isMobile, reduceMotion } = context.conditions as HistoryAnimationConditions;
    const pathData = isMobile ? 'M 70 50 L 70 950' : 'M 500 50 L 500 950';
    base.setAttribute('d', pathData);
    trail.setAttribute('d', pathData);

    const pathLength = trail.getTotalLength();
    gsap.set(trail, { strokeDasharray: pathLength, strokeDashoffset: reduceMotion ? 0 : pathLength });
    gsap.set(marker, { xPercent: -50, yPercent: -50, autoAlpha: reduceMotion ? 1 : 0, scale: reduceMotion ? 1 : 1.4 });

    let entryTimeline: gsap.core.Timeline | undefined;
    if (!reduceMotion) {
      const getEntryGeometry = () => ({
        from: { x: window.innerWidth / 2, y: window.innerHeight + 26 },
        to: {
          x: track.getBoundingClientRect().left + (isMobile ? 70 : 500) * track.clientWidth / 1000,
          y: track.clientHeight * .05
        },
        markerSize: marker.getBoundingClientRect().width
      });
      const entryThreadPath = (): string => {
        const points = getEntryGeometry();
        updateStarThreadPath(journey.threadSvg, journey.thread, points.from, points.to);
        return journey.thread.getAttribute('d') ?? '';
      };

      entryTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: 'top bottom',
          endTrigger: track,
          end: 'top top',
          scrub: .45,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (self.isActive) entryThreadPath();
          }
        }
      });
      entryTimeline
        .set(journey.thread, {
          strokeDasharray: 1,
          strokeDashoffset: 1,
          autoAlpha: 0,
          immediateRender: false
        }, 0)
        .fromTo(journey.star, {
          xPercent: -50,
          yPercent: -50,
          x: () => getEntryGeometry().from.x,
          y: () => getEntryGeometry().from.y,
          width: 52,
          height: 52,
          rotation: -18,
          autoAlpha: 1
        }, {
          x: () => getEntryGeometry().to.x,
          y: () => getEntryGeometry().to.y,
          width: () => getEntryGeometry().markerSize,
          height: () => getEntryGeometry().markerSize,
          rotation: 0,
          autoAlpha: 1,
          duration: 1,
          ease: 'none',
          immediateRender: false
        }, 0)
        .fromTo(journey.thread, { strokeDashoffset: 1, autoAlpha: 0 }, {
          strokeDashoffset: 0,
          autoAlpha: .88,
          duration: 1,
          immediateRender: false
        }, 0)
        .to(journey.overlay, { autoAlpha: 1, duration: .01 }, 0)
        .to(journey.overlay, { autoAlpha: 0, duration: .03 }, .97);

      entryTimeline.eventCallback('onUpdate', () => {
        if (entryTimeline?.scrollTrigger?.isActive) entryThreadPath();
        const progress = entryTimeline?.progress() ?? 0;
        gsap.set(marker, { autoAlpha: gsap.utils.clamp(0, 1, (progress - .88) / .12) });
      });
    }

    let activeIndex = -1;
    const updateMilestone = (index: number): void => {
      if (activeIndex === index) return;
      activeIndex = index;
      onActiveChange(index);

      const card = cards[index];
      const revealTargets = card.querySelectorAll<HTMLElement>('.history-year, h3, .history-description');
      if (!reduceMotion) {
        gsap.fromTo(revealTargets, { autoAlpha: .62, y: 8 }, {
          autoAlpha: 1,
          y: 0,
          duration: .32,
          stagger: .045,
          ease: 'power2.out',
          overwrite: true
        });
      }
    };

    const update = (progress: number): void => {
      const segmentCount = milestoneCount - 1;
      const segmentPosition = Math.min(segmentCount, progress * segmentCount);
      const segmentIndex = Math.min(segmentCount - 1, Math.floor(segmentPosition));
      const segmentProgress = segmentPosition - segmentIndex;
      const travelProgress = segmentIndex === segmentCount
        ? 1
        : (segmentIndex + Math.min(1, segmentProgress / .82) ** 2 * (3 - 2 * Math.min(1, segmentProgress / .82))) / segmentCount;
      const point = trail.getPointAtLength(pathLength * travelProgress);
      const x = point.x * track.clientWidth / 1000;
      const y = point.y * track.clientHeight / 1000;
      const milestoneIndex = Math.min(milestoneCount - 1, Math.floor(travelProgress * segmentCount + .00001));
      const formation = Math.min(1, travelProgress / .05);
      const activeStarColor = getComputedStyle(marker).getPropertyValue('--star-point-active').trim();
      const inactiveStarColor = getComputedStyle(marker).getPropertyValue('--star-point-inactive').trim();
      const markerScale = travelProgress < .025
        ? 1.4 - .9 * travelProgress / .025
        : travelProgress < .05
          ? .5 + .5 * (travelProgress - .025) / .025
          : 1;

      if (reduceMotion) {
        gsap.set(trail, { strokeDashoffset: 0 });
        gsap.set(marker, { x, y, scale: 1 });
      } else {
        gsap.set(trail, { strokeDashoffset: pathLength * (1 - travelProgress) });
        gsap.set(marker, { x, y, scale: markerScale });
        starFaces.forEach((face, index) => {
          const pointProgress = gsap.utils.clamp(0, 1, (formation - index * .2) / .2);
          face.style.fill = gsap.utils.interpolate(inactiveStarColor, activeStarColor, pointProgress);
          face.style.opacity = String(.48 + .52 * pointProgress);
        });
      }
      updateMilestone(milestoneIndex);
    };

    const trigger = ScrollTrigger.create({
      trigger: track,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      invalidateOnRefresh: true,
      onUpdate: (self) => update(self.progress),
      onRefresh: (self) => update(self.progress)
    });
    const themeRoot = root.closest('.hero-shell');
    const themeObserver = themeRoot ? new MutationObserver(() => update(trigger.progress)) : null;
    if (themeRoot && themeObserver) themeObserver.observe(themeRoot, { attributes: true, attributeFilter: ['class'] });

    update(trigger.progress);
    ScrollTrigger.refresh();
    return () => {
      themeObserver?.disconnect();
      trigger.kill();
      entryTimeline?.scrollTrigger?.kill();
    };
  });

  return () => media.revert();
}
