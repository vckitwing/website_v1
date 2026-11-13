import { gsap } from 'gsap';

type OpeningElements = {
  screen: HTMLElement;
  canvas: HTMLCanvasElement;
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
    const starStart = this.elements.star.getBoundingClientRect();
    const anchor = this.elements.heroAnchor.getBoundingClientRect();
    const brandVck = this.elements.brandVck.getBoundingClientRect();
    const brandName = this.elements.brandName.getBoundingClientRect();
    const size = Math.min(150, anchor.width * 0.38, anchor.height * 0.28);
    const destinationScale = size / Math.max(starStart.width, 1);
    const starCenterX = starStart.left + starStart.width / 2;
    const starCenterY = starStart.top + starStart.height / 2;
    const centerStarX = window.innerWidth / 2 - starCenterX;
    const vckFrom = this.elements.vck.getBoundingClientRect();
    const nameFrom = this.elements.name.getBoundingClientRect();
    const identityGap = Number.parseFloat(getComputedStyle(this.elements.identity).columnGap) || 0;
    const expandedNameLeft = window.innerWidth / 2 - (nameFrom.width + identityGap + starStart.width) / 2;
    const expandedCopyX = expandedNameLeft - nameFrom.left;
    const expandedStarX = expandedNameLeft + nameFrom.width + identityGap + starStart.width / 2 - starCenterX;
    const expandedContentCenterY = (
      vckFrom.top + vckFrom.height / 2 + nameFrom.top + nameFrom.height / 2
    ) / 2;
    const expandedStarY = expandedContentCenterY - starCenterY;
    const vckScale = this.fontSize(this.elements.brandVck) / this.fontSize(this.elements.vck);
    const nameScale = this.fontSize(this.elements.brandName) / this.fontSize(this.elements.name);
    const compactScale = Math.max(0.36, this.fontSize(this.elements.name) * 2 / this.fontSize(this.elements.vck));

    this.elements.screen.classList.add('opening-active');
    gsap.set(this.elements.screen, { autoAlpha: 1 });
    gsap.set(this.elements.star, { scale: 0.18, autoAlpha: 0, x: centerStarX, y: 0 });
    gsap.set([this.elements.vck, this.elements.name], { autoAlpha: 0, x: 0, y: 0, scale: 1 });
    const vertices = Array.from(this.elements.star.querySelectorAll<SVGCircleElement>('.opening-star-vertex'));
    gsap.set(vertices, { scale: 0.2, autoAlpha: 0, transformOrigin: '50% 50%' });

    this.timeline = gsap.timeline({
      onComplete: () => {
        this.complete = true;
        this.stopDrawing();
        this.elements.screen.classList.add('opening-complete');
        this.onComplete();
      }
    });

    this.timeline
      .to(this.elements.star, { scale: 1, autoAlpha: 1, duration: 0.52, ease: 'back.out(2)' }, 0.12)
      .to(state, {
        progress: 1,
        duration: 1.12,
        ease: 'power2.out',
        onUpdate: () => this.draw(state.progress, state.glow)
      }, 0.48)
      .to(state, {
        glow: 1,
        duration: 0.65,
        ease: 'sine.inOut',
        onUpdate: () => this.draw(state.progress, state.glow)
      }, 0.72)
      .to(this.elements.star, { x: 0, duration: 0.5, ease: 'power2.inOut' }, 0.82)
      .fromTo(this.elements.vck, { autoAlpha: 0, y: 18, scale: 0.94 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.62, ease: 'power3.out' }, 1.06)
      .to(this.elements.star, { x: expandedStarX, y: expandedStarY, duration: 0.82, ease: 'power2.inOut' }, 1.82)
      .to(this.elements.vck, {
        x: expandedCopyX,
        scale: compactScale,
        duration: 0.82,
        ease: 'power2.inOut'
      }, 1.82)
      .fromTo(this.elements.name, {
        autoAlpha: 0,
        x: expandedCopyX,
        scaleX: 0.08,
        transformOrigin: '0% 50%'
      }, {
        autoAlpha: 1,
        x: expandedCopyX,
        scaleX: 1,
        duration: 0.82,
        ease: 'power2.out'
      }, 1.82)
      .to(this.elements.star, {
        x: anchor.left + anchor.width / 2 - (starStart.left + starStart.width / 2),
        y: anchor.top + anchor.height / 2 - (starStart.top + starStart.height / 2),
        scale: destinationScale,
        duration: 1.25,
        ease: 'power2.inOut',
        onStart: this.onStarArrival
      }, 3.02)
      .to(this.elements.vck, {
        x: brandVck.left + brandVck.width / 2 - (vckFrom.left + vckFrom.width / 2),
        y: brandVck.top + brandVck.height / 2 - (vckFrom.top + vckFrom.height / 2),
        scale: vckScale,
        duration: 0.9,
        ease: 'power2.inOut'
      }, 3.1)
      .to(this.elements.name, {
        x: brandName.width ? brandName.left + brandName.width / 2 - (nameFrom.left + nameFrom.width / 2) : 0,
        y: brandName.height ? brandName.top + brandName.height / 2 - (nameFrom.top + nameFrom.height / 2) : 0,
        scale: brandName.width ? nameScale : 0.8,
        autoAlpha: brandName.width ? 1 : 0,
        duration: 0.9,
        ease: 'power2.inOut'
      }, 3.1)
      .to(state, { progress: 1.2, duration: 0.7, ease: 'power1.in', onUpdate: () => this.draw(state.progress, state.glow) }, 3.65)
      .to(this.elements.screen, { autoAlpha: 0, duration: 0.42, ease: 'power1.out' }, 4.25);
    vertices.forEach((vertex, index) => {
      const time = 0.52 + index * 0.085;
      this.timeline?.fromTo(vertex, { scale: 0.2, autoAlpha: 0 }, {
        scale: 1.8,
        autoAlpha: 1,
        duration: 0.2,
        ease: 'back.out(2)'
      }, time).to(vertex, { scale: 1, duration: 0.25, ease: 'power2.out' }, time + 0.2);
    });
  }

  destroy(): void {
    this.timeline?.kill();
    this.resizeObserver.disconnect();
    this.stopDrawing();
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
