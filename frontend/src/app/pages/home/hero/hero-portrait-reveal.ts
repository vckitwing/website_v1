import { gsap } from 'gsap';

const REVEAL_SESSION_KEY = 'vck-hero-portrait-reveal-complete';
let revealStartedThisPage = false;

export function hasCompletedHeroPortraitReveal(): boolean {
  if (revealStartedThisPage) return true;
  try {
    return sessionStorage.getItem(REVEAL_SESSION_KEY) === '1';
  } catch (error) {
    console.error('Unable to read the hero portrait reveal session state.', error);
    return false;
  }
}

function markHeroPortraitRevealStarted(): void {
  revealStartedThisPage = true;
  try {
    sessionStorage.setItem(REVEAL_SESSION_KEY, '1');
  } catch (error) {
    console.error('Unable to save the hero portrait reveal session state.', error);
  }
}

export class HeroPortraitReveal {
  private timeline?: gsap.core.Timeline;
  private readonly edgeCanvas = document.createElement('canvas');

  constructor(
    private readonly image: HTMLImageElement,
    private readonly traceCanvas: HTMLCanvasElement,
    private readonly onProgress: (progress: number) => void
  ) {}

  play(reducedMotion: boolean): void {
    if (reducedMotion || hasCompletedHeroPortraitReveal()) {
      this.showFinalState();
      markHeroPortraitRevealStarted();
      return;
    }

    markHeroPortraitRevealStarted();
    this.drawPortraitContours();

    const network = { progress: 0 };
    gsap.set(this.image, { autoAlpha: 0, clipPath: 'inset(100% 0 0)' });
    gsap.set(this.traceCanvas, {
      autoAlpha: 1,
      clipPath: 'inset(100% 0 0)',
      scale: 1,
      transformOrigin: '50% 50%'
    });
    this.onProgress(0);

    this.timeline = gsap.timeline({
      onComplete: () => this.showFinalState()
    });
    this.timeline
      .to(this.traceCanvas, { clipPath: 'inset(0% 0 0)', duration: 1, ease: 'power1.inOut' }, 0)
      .to(this.image, { autoAlpha: 1, clipPath: 'inset(0% 0 0)', duration: 2, ease: 'power2.inOut' }, 1)
      .to(this.traceCanvas, { autoAlpha: 0, duration: 0.42, ease: 'power1.out' }, 2.65)
      .to(network, {
        progress: 1,
        duration: 2,
        ease: 'power2.inOut',
        onUpdate: () => this.onProgress(network.progress)
      }, 3)
      .to(this.traceCanvas, { scale: 1.045, duration: 1.2, ease: 'power2.out' }, 3);
  }

  showFinalState(): void {
    this.timeline?.kill();
    gsap.set(this.image, { autoAlpha: 1, clearProps: 'clipPath,transform' });
    gsap.set(this.traceCanvas, { autoAlpha: 0, clearProps: 'clipPath,transform' });
    this.onProgress(1);
  }

  destroy(): void {
    this.timeline?.kill();
    this.edgeCanvas.width = 0;
    this.edgeCanvas.height = 0;
    gsap.set(this.image, { autoAlpha: 1, clearProps: 'clipPath,transform' });
    gsap.set(this.traceCanvas, { autoAlpha: 0, clearProps: 'clipPath,transform' });
  }

  private drawPortraitContours(): void {
    if (!this.image.complete || !this.image.naturalWidth || !this.image.naturalHeight) {
      throw new Error('The original hero portrait must be loaded before its contour reveal can start.');
    }

    const width = Math.min(600, this.image.naturalWidth);
    const height = Math.round(width * this.image.naturalHeight / this.image.naturalWidth);
    const source = document.createElement('canvas');
    source.width = width;
    source.height = height;
    this.edgeCanvas.width = width;
    this.edgeCanvas.height = height;

    const sourceContext = source.getContext('2d', { willReadFrequently: true });
    const edgeContext = this.edgeCanvas.getContext('2d');
    if (!sourceContext || !edgeContext) {
      throw new Error('Unable to create the hero portrait contour canvases.');
    }

    sourceContext.drawImage(this.image, 0, 0, width, height);
    const sourcePixels = sourceContext.getImageData(0, 0, width, height);
    const edges = edgeContext.createImageData(width, height);
    const luminance = new Float32Array(width * height);
    const alpha = new Float32Array(width * height);
    for (let index = 0; index < width * height; index++) {
      const offset = index * 4;
      const opacity = sourcePixels.data[offset + 3] / 255;
      alpha[index] = opacity;
      luminance[index] = (sourcePixels.data[offset] * 0.2126
        + sourcePixels.data[offset + 1] * 0.7152
        + sourcePixels.data[offset + 2] * 0.0722) * opacity;
    }

    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const index = y * width + x;
        const topLeft = index - width - 1;
        const top = index - width;
        const topRight = index - width + 1;
        const left = index - 1;
        const right = index + 1;
        const bottomLeft = index + width - 1;
        const bottom = index + width;
        const bottomRight = index + width + 1;
        const gradientX = -luminance[topLeft] + luminance[topRight]
          - 2 * luminance[left] + 2 * luminance[right]
          - luminance[bottomLeft] + luminance[bottomRight];
        const gradientY = -luminance[topLeft] - 2 * luminance[top] - luminance[topRight]
          + luminance[bottomLeft] + 2 * luminance[bottom] + luminance[bottomRight];
        const strength = Math.hypot(gradientX, gradientY);
        const contourAlpha = Math.min(220, Math.max(0, (strength - 115) * 0.8)) * alpha[index];
        if (contourAlpha < 8) continue;

        const offset = index * 4;
        const redSide = 1 - x / width; // the portrait is mirrored on screen, so the colours are mirrored too
        edges.data[offset] = Math.round(39 + (237 - 39) * redSide);
        edges.data[offset + 1] = Math.round(133 + (42 - 133) * redSide);
        edges.data[offset + 2] = Math.round(223 + (64 - 223) * redSide);
        edges.data[offset + 3] = contourAlpha;
      }
    }

    edgeContext.putImageData(edges, 0, 0);
    const imageBounds = this.image.getBoundingClientRect();
    this.traceCanvas.style.width = `${imageBounds.width}px`;
    this.traceCanvas.style.height = `${imageBounds.height}px`;
    const canvasBounds = this.traceCanvas.getBoundingClientRect();
    this.traceCanvas.width = Math.max(1, Math.round(canvasBounds.width * Math.min(devicePixelRatio || 1, 1.5)));
    this.traceCanvas.height = Math.max(1, Math.round(canvasBounds.height * Math.min(devicePixelRatio || 1, 1.5)));
    const context = this.traceCanvas.getContext('2d');
    if (!context) throw new Error('Unable to draw the hero portrait contours.');
    context.scale(this.traceCanvas.width / Math.max(canvasBounds.width, 1), this.traceCanvas.height / Math.max(canvasBounds.height, 1));

    const mobile = window.matchMedia('(max-width: 760px)').matches;
    const scale = Math.min(canvasBounds.width / this.image.naturalWidth, canvasBounds.height / this.image.naturalHeight);
    const drawWidth = this.image.naturalWidth * scale;
    const drawHeight = this.image.naturalHeight * scale;
    const drawX = mobile ? (canvasBounds.width - drawWidth) / 2 : canvasBounds.width - drawWidth;
    const drawY = mobile ? canvasBounds.height - drawHeight : (canvasBounds.height - drawHeight) / 2;
    context.shadowBlur = 7;
    context.shadowColor = 'rgba(77, 165, 255, .45)';
    // The photo is mirrored on screen, so the contours are drawn mirrored too.
    context.save();
    context.translate(drawX + drawWidth, drawY);
    context.scale(-1, 1);
    context.drawImage(this.edgeCanvas, 0, 0, drawWidth, drawHeight);
    context.restore();
    context.shadowBlur = 0;
    source.width = 0;
  }
}
