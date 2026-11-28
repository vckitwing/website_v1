import { gsap } from 'gsap';

/** Phones show roles of the same level as a moving row (keep in step with the stylesheet). */
const PHONE_QUERY = '(max-width: 700px)';

const SPEED = 22; // pixels a second: slow enough to read while it moves
const START_DELAY = 2000; // time to see a row before it moves
const RESUME_DELAY = 2500; // after the thumb is lifted
const END_REST = 2500; // on the first and last card, before turning round

export interface GlidingRows {
  dispose(): void;
}

/**
 * Slowly moves each row of same-level roles to its last card and back again, every row on its own.
 * There is no pause button: a thumb resting on a row holds it still, and swiping moves it by hand.
 * Nothing moves on wider screens, with reduced motion, off screen, while a card has keyboard focus, or while
 * `blocked` says the reader is busy elsewhere (the details sheet, the search results).
 */
export function createGlidingRows(rows: readonly HTMLElement[], blocked: () => boolean): GlidingRows {
  const phone = matchMedia(PHONE_QUERY);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const stops = rows.map((row) => glide(row, () => phone.matches && !reduced.matches, blocked));
  return {
    dispose: () => stops.forEach((stop) => stop())
  };
}

function glide(row: HTMLElement, allowed: () => boolean, blocked: () => boolean): () => void {
  const listeners = new AbortController();
  const passive: AddEventListenerOptions = { passive: true, signal: listeners.signal };

  let position = row.scrollLeft;
  let written = position; // the last place the loop put the row, to tell its scrolls from the reader's
  let direction: 1 | -1 = 1;
  let holding = false;
  let focused = false;
  let visible = false;
  let resumeAt = 0;

  const later = (delay: number): void => {
    resumeAt = Math.max(resumeAt, performance.now() + delay);
  };
  const hold = (): void => {
    holding = true;
  };
  const release = (): void => {
    holding = false;
    later(RESUME_DELAY);
  };

  // touch events keep arriving while the finger scrolls the row (pointer events are cancelled then)
  row.addEventListener('touchstart', hold, passive);
  row.addEventListener('touchend', release, passive);
  row.addEventListener('touchcancel', release, passive);
  row.addEventListener('wheel', () => later(RESUME_DELAY), passive);
  row.addEventListener(
    'pointerdown',
    (event) => {
      if (event.pointerType === 'mouse') hold();
    },
    passive
  );
  window.addEventListener(
    'pointerup',
    (event) => {
      if (event.pointerType === 'mouse' && holding) release();
    },
    passive
  );
  row.addEventListener(
    'focusin',
    (event) => {
      focused = (event.target as HTMLElement).matches(':focus-visible');
    },
    passive
  );
  row.addEventListener('focusout', () => (focused = false), passive);
  row.addEventListener(
    'scroll',
    () => {
      // the reader (a swipe, or a jump to a role) moved the row: carry on from there, after a moment
      if (Math.abs(row.scrollLeft - written) > 2) {
        position = written = row.scrollLeft;
        later(RESUME_DELAY);
      }
    },
    passive
  );

  const watcher = new IntersectionObserver(
    ([entry]) => {
      const seen = entry.intersectionRatio >= 0.6;
      if (seen && !visible) later(START_DELAY);
      visible = seen;
    },
    { threshold: [0, 0.6] }
  );
  watcher.observe(row);

  const tick = (_time: number, elapsed: number): void => {
    if (!allowed() || !visible || holding || focused || document.hidden) return;
    if (blocked()) {
      later(RESUME_DELAY);
      return;
    }
    if (performance.now() < resumeAt) return;
    const end = row.scrollWidth - row.clientWidth;
    if (end <= 1) return;

    // a long gap (a busy or hidden tab) must not make the row leap
    position = Math.min(end, Math.max(0, position + (direction * SPEED * Math.min(elapsed, 100)) / 1000));
    row.scrollLeft = position;
    written = row.scrollLeft;
    if ((direction === 1 && position >= end - 0.5) || (direction === -1 && position <= 0.5)) {
      direction = direction === 1 ? -1 : 1;
      later(END_REST);
    }
  };
  gsap.ticker.add(tick);

  return () => {
    gsap.ticker.remove(tick);
    watcher.disconnect();
    listeners.abort();
  };
}
