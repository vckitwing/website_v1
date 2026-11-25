import { gsap } from 'gsap';

type OpeningElements = {
  screen: HTMLElement;
  canvas: HTMLCanvasElement;
  flag: SVGSVGElement;
  star: SVGSVGElement;
  identity: HTMLElement;
  vck: HTMLElement;
  name: HTMLElement;
  brandVck: HTMLElement;
  brandName: HTMLElement;
  heroAnchor: HTMLElement;
};

type BurstParticle = {
  angle: number;
  distance: number;
  origin: number;
  size: number;
  color: string;
};

export class OpeningAnimation {
  private readonly context: CanvasRenderingContext2D | null;
  private readonly particles: BurstParticle[];
  private timeline?: gsap.core.Timeline;
  private frame = 0;
  private width = 0;
  private height = 0;
  private pixelRatio = 1;
  private complete = false;
  private readonly resizeObserver: ResizeObserver;

  constructor(
    private readonly elements: OpeningElements,
    private readonly onStarArrival: () => void,
    private readonly onComplete: () => void
  ) {
    this.context = elements.canvas.getContext('2d');
    this.particles = Array.from({ length: 190 }, (_, index) => {
      const angle = Math.random() * Math.PI * 2;
      return {
        angle,
        distance: 0.16 + Math.random() * 0.84,
        origin: index % 5,
        size: 0.7 + Math.random() * 1.5,
        color: Math.cos(angle) < 0 ? '#2785df' : '#ed2a40'
      };
    });
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(elements.screen);
    this.resize();
  }

  play(reducedMotion: boolean): void {
    if (reducedMotion || !this.context) {
      this.elements.screen.classList.add('opening-complete');
      this.onStarArrival();
      this.onComplete();
      return;
    }

    const state = { progress: 0, glow: 0 };
    const { screen, flag, star, vck, name, brandVck, brandName, heroAnchor } = this.elements;
    const screenRect = screen.getBoundingClientRect();
    const S = star.getBoundingClientRect(); // natural layout: [ VCK ][ star ], centred on the page
    const V = vck.getBoundingClientRect();
    const N = name.getBoundingClientRect();
    const anchor = heroAnchor.getBoundingClientRect();
    const bV = brandVck.getBoundingClientRect();
    const bN = brandName.getBoundingClientRect();
    const pageCenterX = screenRect.left + screenRect.width / 2;
    const starCenterX = S.left + S.width / 2;
    const starCenterY = S.top + S.height / 2;
    const startOffsetX = pageCenterX - starCenterX; // the star first appears alone, at the page centre

    // Step 2 - compact lock-up: VCK shrinks, rises and sits right-aligned above the full name; together they are
    // exactly as tall as the star, and the whole group is centred on the page.
    const vckFont = this.fontSize(vck);
    const nameFont = this.fontSize(name);
    const compactScale = Math.max(0.36, (nameFont * 2) / vckFont);
    const nameGap = N.top - (V.top + V.height);
    const compactVckHeight = V.height * compactScale;
    const blockHeight = compactVckHeight + nameGap + N.height;
    const lockupStarScale = blockHeight / S.height;
    const lockupGap = Math.max(12, blockHeight * 0.35);
    const groupLeft = pageCenterX - (N.width + lockupGap + blockHeight) / 2;
    const blockTop = starCenterY - blockHeight / 2;
    const vckLockup = { x: groupLeft + N.width - V.width * compactScale - V.left, y: blockTop - V.top };
    const nameLockup = { x: groupLeft - N.left, y: blockTop + compactVckHeight + nameGap - N.top };
    const starLockup = { x: groupLeft + N.width + lockupGap + blockHeight / 2 - starCenterX, y: 0 };

    // Step 3 - flight to the header: text turns left-aligned and lands exactly on the header's own VCK / name
    // (same size, letter-spacing, weight and colour), so the hand-off to the real header is seamless.
    const vckLanding = this.landing(V, vckFont, getComputedStyle(vck), bV, getComputedStyle(brandVck), this.fontSize(brandVck));
    const nameLanding = this.landing(N, nameFont, getComputedStyle(name), bN, getComputedStyle(brandName), this.fontSize(brandName));
    // On narrow screens the header wraps the name onto two lines; reflow the flying copy to match.
    const brandNameLineHeight = this.lineHeight(getComputedStyle(brandName), this.fontSize(brandName));
    const brandNameWraps = bN.height > brandNameLineHeight * 1.6;

    // Freeze the text column's width: the letter-spacing animation below must not re-centre the flex row.
    gsap.set(vck.parentElement, { width: V.width });

    screen.classList.add('opening-active');
    gsap.set(screen, { autoAlpha: 1 });
    // The flag sits where the star will first appear (the page centre); the star starts as the flag's own white star.
    const flagBlue = flag.querySelector<SVGRectElement>('.opening-flag-blue');
    const flagRed = flag.querySelector<SVGRectElement>('.opening-flag-red');
    const flagWidth = flag.getBoundingClientRect().width;
    const flagStarScale = (flagWidth * (168.4 / 900)) / Math.max(S.width, 1); // the flag's star is 168.4 of 900 units wide
    const screenCenterY = screenRect.top + screenRect.height / 2;
    gsap.set(flag, { xPercent: -50, yPercent: -50, y: starCenterY - screenCenterY, autoAlpha: 0, scale: 0.9, transformOrigin: '50% 50%' });
    gsap.set(flagBlue, { scaleY: 0, y: 0, transformOrigin: '50% 0%' });
    gsap.set(flagRed, { scaleY: 0, y: 0, transformOrigin: '50% 100%' });
    gsap.set(star, { scale: flagStarScale * 0.4, rotation: -24, autoAlpha: 0, x: startOffsetX, y: 0 });
    const D = 0.72; // the flag opening adds this much before the original sequence continues
    gsap.set([vck, name], { autoAlpha: 0, x: 0, y: 0, scale: 1, transformOrigin: '0 0' });
    const shell = brandVck.closest('.hero-shell');

    this.timeline = gsap.timeline({
      onComplete: () => {
        this.complete = true;
        this.stopDrawing();
        screen.classList.add('opening-complete');
        this.onComplete();
      }
    });

    this.timeline
      // 0 - the flag unfurls in the middle of the page with its white star...
      .to(flag, { autoAlpha: 1, scale: 1, duration: 0.55, ease: 'power2.out' }, 0)
      .to(flagBlue, { scaleY: 1, duration: 0.55, ease: 'power2.inOut' }, 0)
      .to(flagRed, { scaleY: 1, duration: 0.55, ease: 'power2.inOut' }, 0.1)
      .to(star, { scale: flagStarScale, rotation: 0, autoAlpha: 1, duration: 0.5, ease: 'back.out(1.8)' }, 0.35)
      // ...then the star lifts off the flag, which parts and fades away.
      .to(star, { scale: 1, duration: 0.62, ease: 'back.out(1.6)' }, 0.95)
      .to(flagBlue, { y: -70, duration: 0.55, ease: 'power2.in' }, 1.0)
      .to(flagRed, { y: 70, duration: 0.55, ease: 'power2.in' }, 1.0)
      .to(flag, { autoAlpha: 0, scale: 1.1, duration: 0.55, ease: 'power2.in' }, 1.0)
      .to(state, {
        progress: 1,
        duration: 1.12,
        ease: 'power2.out',
        onUpdate: () => this.draw(state.progress, state.glow)
      }, 1.0)
      .to(state, {
        glow: 1,
        duration: 0.65,
        ease: 'sine.inOut',
        onUpdate: () => this.draw(state.progress, state.glow)
      }, 1.22)
      // ...then moves right to make room, and VCK arrives on its left; the pair is centred.
      .to(star, { x: 0, duration: 0.5, ease: 'power2.inOut' }, 0.82 + D)
      .fromTo(vck, { autoAlpha: 0, x: -34, y: 0, scale: 0.94 }, { autoAlpha: 1, x: 0, y: 0, scale: 1, duration: 0.62, ease: 'power3.out' }, 1.06 + D)
      // 2 - VCK shrinks and rises to the star's height; the full name appears beneath it, right-aligned.
      .to(star, { x: starLockup.x, y: starLockup.y, scale: lockupStarScale, duration: 0.82, ease: 'power2.inOut' }, 1.82 + D)
      .to(vck, { x: vckLockup.x, y: vckLockup.y, scale: compactScale, duration: 0.82, ease: 'power2.inOut' }, 1.82 + D)
      .fromTo(name, {
        autoAlpha: 0,
        x: nameLockup.x,
        y: nameLockup.y,
        scaleX: 0.08,
        scaleY: 1
      }, {
        autoAlpha: 1,
        x: nameLockup.x,
        y: nameLockup.y,
        scaleX: 1,
        duration: 0.82,
        ease: 'power2.out'
      }, 1.82 + D)
      // 3 - the star flies to the portrait; VCK and the name turn left-aligned and settle into the header.
      .to(star, {
        x: anchor.left + anchor.width / 2 - starCenterX,
        y: anchor.top + anchor.height / 2 - starCenterY,
        scale: Math.min(150, anchor.width * 0.38, anchor.height * 0.28) / Math.max(S.width, 1),
        duration: 1.25,
        ease: 'power2.inOut',
        onStart: this.onStarArrival
      }, 3.02 + D)
      .set(name, brandNameWraps ? { textAlign: 'left', whiteSpace: 'normal', maxWidth: 'none', width: bN.width / nameLanding.scale } : { textAlign: 'left' }, 3.1 + D)
      .set(vck, { textAlign: 'left' }, 3.1 + D)
      .to(vck, {
        x: vckLanding.x,
        y: vckLanding.y,
        scale: vckLanding.scale,
        letterSpacing: vckLanding.letterSpacing,
        duration: 0.9,
        ease: 'power2.inOut'
      }, 3.1 + D)
      .to(name, {
        x: nameLanding.x,
        y: nameLanding.y,
        scale: nameLanding.scale,
        letterSpacing: nameLanding.letterSpacing,
        fontWeight: nameLanding.fontWeight,
        color: nameLanding.color,
        duration: 0.9,
        ease: 'power2.inOut'
      }, 3.1 + D)
      // The header's own text becomes visible exactly underneath, then the intro screen fades away.
      .add(() => shell?.classList.add('opening-brand-ready'), 4.05 + D)
      .to(state, { progress: 1.2, duration: 0.7, ease: 'power1.in', onUpdate: () => this.draw(state.progress, state.glow) }, 3.65 + D)
      .to(screen, { autoAlpha: 0, duration: 0.42, ease: 'power1.out' }, 4.25 + D)
      .add(() => shell?.classList.remove('opening-brand-ready'), 4.7 + D);
  }

  destroy(): void {
    this.timeline?.kill();
    this.resizeObserver.disconnect();
    this.stopDrawing();
  }

  /** Transform + typography that make a flying element coincide with the header text it becomes. */
  private landing(
    from: DOMRect,
    fromFont: number,
    fromStyle: CSSStyleDeclaration,
    to: DOMRect,
    toStyle: CSSStyleDeclaration,
    toFont: number
  ): { x: number; y: number; scale: number; letterSpacing: number; fontWeight: number; color: string } {
    const scale = toFont / fromFont;
    const fromLine = this.lineHeight(fromStyle, fromFont) * scale;
    const toLine = this.lineHeight(toStyle, toFont);
    const toSpacing = Number.parseFloat(toStyle.letterSpacing);
    return {
      x: to.left - from.left, // origin is the top-left corner, so this is the left edge: left-aligned with the header
      y: to.top + (toLine - fromLine) / 2 - from.top, // first lines share a centre line
      scale,
      letterSpacing: (Number.isFinite(toSpacing) ? toSpacing : 0) / scale, // CSS value; the scale then shrinks it
      fontWeight: Number.parseInt(toStyle.fontWeight, 10) || 400,
      color: toStyle.color
    };
  }

  private lineHeight(style: CSSStyleDeclaration, fontSize: number): number {
    const value = Number.parseFloat(style.lineHeight);
    return Number.isFinite(value) ? value : fontSize * 1.2;
  }

  private fontSize(element: HTMLElement): number {
    return Number.parseFloat(getComputedStyle(element).fontSize) || 16;
  }

  private resize(): void {
    const { screen, canvas } = this.elements;
    const rect = screen.getBoundingClientRect();
    this.width = Math.max(1, rect.width);
    this.height = Math.max(1, rect.height);
    this.pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(this.width * this.pixelRatio);
    canvas.height = Math.round(this.height * this.pixelRatio);
    canvas.style.width = `${this.width}px`;
    canvas.style.height = `${this.height}px`;
  }

  private draw(progress: number, glow: number): void {
    const context = this.context;
    if (!context || this.complete) return;
    this.stopDrawing();

    const { canvas, star } = this.elements;
    const rect = star.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const radius = Math.max(8, rect.width * 0.56);
    const spread = Math.max(this.width, this.height) * 0.62 * Math.min(progress, 1);
    context.setTransform(this.pixelRatio, 0, 0, this.pixelRatio, 0, 0);
    context.clearRect(0, 0, this.width, this.height);

    const positions = this.particles.map((particle) => {
      const originAngle = -Math.PI / 2 + particle.origin * Math.PI * 2 / 5;
      const ox = centerX + Math.cos(originAngle) * radius;
      const oy = centerY + Math.sin(originAngle) * radius;
      const travel = spread * particle.distance;
      return {
        x: ox + Math.cos(particle.angle) * travel,
        y: oy + Math.sin(particle.angle) * travel,
        color: particle.color,
        size: particle.size
      };
    });

    context.lineWidth = 0.7;
    for (let i = 0; i < positions.length; i++) {
      const from = positions[i];
      let linked = 0;
      for (let j = i + 1; j < positions.length && linked < 3; j++) {
        const to = positions[j];
        const distance = Math.hypot(to.x - from.x, to.y - from.y);
        const maxDistance = 36 + Math.min(progress, 1) * 76;
        if (distance > maxDistance) continue;
        context.strokeStyle = from.color === '#2785df'
          ? `rgba(39,133,223,${(1 - distance / maxDistance) * 0.24 * (0.25 + glow)})`
          : `rgba(237,42,64,${(1 - distance / maxDistance) * 0.21 * (0.25 + glow)})`;
        context.beginPath();
        context.moveTo(from.x, from.y);
        context.lineTo(to.x, to.y);
        context.stroke();
        linked++;
      }
    }

    for (const point of positions) {
      context.fillStyle = point.color === '#2785df'
        ? `rgba(104,190,255,${0.18 + glow * 0.5})`
        : `rgba(255,87,105,${0.18 + glow * 0.48})`;
      context.beginPath();
      context.arc(point.x, point.y, point.size * (0.7 + glow * 0.55), 0, Math.PI * 2);
      context.fill();
    }

    this.frame = requestAnimationFrame(() => this.draw(progress, glow));
  }

  private stopDrawing(): void {
    if (this.frame) cancelAnimationFrame(this.frame);
    this.frame = 0;
  }
}
