import * as THREE from 'three';

type PortraitHooks = { onReady: () => void; onFallback: () => void; onFormed: () => void };

const PORTRAIT_URL = '/portraits/thiruma.png?v=2';
const CROWD_URL = '/portraits/red-blue-rally.png';
type CrowdSample = { x: number; y: number; red: number; green: number; blue: number };

/** Three.js point cloud renderer. Kept outside Angular change detection. */
export class ParticlePortrait {
  private readonly image = new Image();
  private readonly crowdImage = new Image();
  private readonly pointer = { x: -1000, y: -1000, down: false };
  private readonly reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  private readonly lowMemory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  private readonly sampleCanvas = document.createElement('canvas');
  private readonly sampleContext = this.sampleCanvas.getContext('2d', { willReadFrequently: true });
  private renderer?: THREE.WebGLRenderer;
  private scene?: THREE.Scene;
  private camera?: THREE.OrthographicCamera;
  private geometry?: THREE.BufferGeometry;
  private material?: THREE.PointsMaterial;
  private particleTexture?: THREE.CanvasTexture;
  private points?: THREE.Points;
  private resizeObserver?: ResizeObserver;
  private raf = 0;
  private resizeTimer = 0;
  private visible = true;
  private imageReady = false;
  private portraitLoaded = false;
  private crowdLoaded = false;
  private initialized = false;
  private hasFormed = false;
  private crowdSamples: CrowdSample[] = [];
  private startTime = performance.now();
  private width = 0;
  private height = 0;
  private sourceX = 0;
  private sourceY = 0;
  private sourceWidth = 0;
  private sourceHeight = 0;
  private starts = new Float32Array();
  private crowdPositions = new Float32Array();
  private targets = new Float32Array();
  private phases = new Float32Array();
  private crowdColors = new Float32Array();
  private portraitColors = new Float32Array();

  constructor(private readonly canvas: HTMLCanvasElement, private readonly hooks: PortraitHooks) {
    try {
      this.renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: false,
        powerPreference: 'high-performance',
        premultipliedAlpha: false
      });
      this.renderer.outputColorSpace = THREE.SRGBColorSpace;
      this.renderer.setClearColor(0x000000, 0);
      this.scene = new THREE.Scene();
      this.camera = new THREE.OrthographicCamera(-3, 3, 3, -3, .1, 100);
    } catch {
      hooks.onFallback();
      return;
    }

    this.image.decoding = 'async';
    this.crowdImage.decoding = 'async';
    this.image.onload = () => { this.portraitLoaded = true; this.initializeWhenReady(); };
    this.crowdImage.onload = () => { this.crowdLoaded = true; this.initializeWhenReady(); };
    this.image.onerror = () => hooks.onFallback();
    this.crowdImage.onerror = () => hooks.onFallback();
    this.image.src = PORTRAIT_URL;
    this.crowdImage.src = CROWD_URL;

    this.resizeObserver = new ResizeObserver(() => {
      window.clearTimeout(this.resizeTimer);
      this.resizeTimer = window.setTimeout(() => this.resize(), 100);
    });
    this.resizeObserver.observe(canvas);
    canvas.addEventListener('pointermove', this.onPointerMove, { passive: true });
    canvas.addEventListener('pointerdown', this.onPointerDown, { passive: true });
    canvas.addEventListener('pointerup', this.onPointerUp, { passive: true });
    canvas.addEventListener('pointerleave', this.onPointerLeave, { passive: true });
    document.addEventListener('visibilitychange', this.onVisibility);
    this.reducedMotion.addEventListener('change', this.onMotionChange);
  }

  private initializeWhenReady(): void {
    if (this.initialized || !this.portraitLoaded || !this.crowdLoaded) return;
    this.initialized = true;
    try {
      this.findPortraitBounds();
      this.readCrowdSamples();
      if (!this.crowdSamples.length) throw new Error('The rally image has no visible pixels to sample.');
      this.imageReady = true;
      this.startTime = performance.now();
      this.resize();
      this.hooks.onReady();
      this.start();
    } catch (error) {
      console.error('Unable to prepare the crowd-to-portrait particle scene.', error);
      this.hooks.onFallback();
    }
  }

  private get targetCount(): number {
    const mobile = window.matchMedia('(max-width: 600px)').matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData ?? false;
    if (saveData || (this.lowMemory ?? 8) <= 2) return mobile ? 9000 : 16000;
    return mobile ? 32000 : 56000;
  }

  /** Trim transparent padding so the point cloud uses the supplied portrait efficiently. */
  private findPortraitBounds(): void {
    if (!this.sampleContext) return;
    const scan = this.sampleCanvas;
    scan.width = this.image.naturalWidth;
    scan.height = this.image.naturalHeight;
    this.sampleContext.drawImage(this.image, 0, 0);
    const pixels = this.sampleContext.getImageData(0, 0, scan.width, scan.height).data;
    let left = scan.width, right = -1, top = scan.height, bottom = -1;
    for (let y = 0; y < scan.height; y++) {
      for (let x = 0; x < scan.width; x++) {
        if (pixels[(y * scan.width + x) * 4 + 3] < 12) continue;
        left = Math.min(left, x); right = Math.max(right, x);
        top = Math.min(top, y); bottom = Math.max(bottom, y);
      }
    }
    if (right < left || bottom < top) return;
    const padX = (right - left + 1) * .035;
    const padY = (bottom - top + 1) * .025;
    this.sourceX = Math.max(0, left - padX);
    this.sourceY = Math.max(0, top - padY);
    this.sourceWidth = Math.min(scan.width - this.sourceX, right - left + 1 + padX * 2);
    this.sourceHeight = Math.min(scan.height - this.sourceY, bottom - top + 1 + padY * 2);
  }

  /** Sample the actual blue and red crowd artwork; black background pixels are ignored. */
  private readCrowdSamples(): void {
    if (!this.sampleContext) return;
    const scanWidth = 768;
    const scanHeight = 384;
    this.sampleCanvas.width = scanWidth;
    this.sampleCanvas.height = scanHeight;
    this.sampleContext.drawImage(this.crowdImage, 0, 0, scanWidth, scanHeight);
    const pixels = this.sampleContext.getImageData(0, 0, scanWidth, scanHeight).data;
    this.crowdSamples = [];
    for (let y = 0; y < scanHeight; y += 1) {
      for (let x = 0; x < scanWidth; x += 1) {
        const i = (y * scanWidth + x) * 4;
        const red = pixels[i], green = pixels[i + 1], blue = pixels[i + 2];
        if (Math.max(red, green, blue) < 12 || y < scanHeight * .25) continue;
        this.crowdSamples.push({ x: x / scanWidth, y: y / scanHeight, red, green, blue });
      }
    }
  }

  private resize(): void {
    if (!this.renderer || !this.camera) return;
    const rect = this.canvas.getBoundingClientRect();
    this.width = Math.max(1, rect.width);
    this.height = Math.max(1, rect.height);
    const dpr = Math.min(window.devicePixelRatio || 1, (this.lowMemory ?? 8) <= 2 ? 1 : 1.5);
    this.renderer.setPixelRatio(dpr);
    this.renderer.setSize(this.width, this.height, false);
    const aspect = this.width / this.height;
    const viewHeight = 5.8;
    const viewWidth = viewHeight * aspect;
    this.camera.left = -viewWidth / 2;
    this.camera.right = viewWidth / 2;
    this.camera.top = viewHeight / 2;
    this.camera.bottom = -viewHeight / 2;
    this.camera.position.set(0, 0, 10);
    this.camera.lookAt(0, 0, 0);
    this.camera.updateProjectionMatrix();
    if (this.imageReady) this.createParticles();
  }

  private createParticles(): void {
    if (!this.sampleContext || !this.scene) return;
    this.geometry?.dispose();
    this.material?.dispose();
    if (this.points) this.scene.remove(this.points);

    const sourceWidth = this.sourceWidth || this.image.naturalWidth;
    const sourceHeight = this.sourceHeight || this.image.naturalHeight;
    const portraitAspect = sourceWidth / sourceHeight;
    const screenAspect = this.width / this.height;
    const viewHeight = 5.8;
    const viewWidth = viewHeight * screenAspect;
    const canvasRect = this.canvas.getBoundingClientRect();
    const stageRect = this.canvas.parentElement?.querySelector<HTMLElement>('.portrait-stage')?.getBoundingClientRect();
    const stageWidth = stageRect ? stageRect.width / this.width * viewWidth : viewWidth * .45;
    const stageHeight = stageRect ? stageRect.height / this.height * viewHeight : viewHeight * .75;
    const mobile = window.matchMedia('(max-width: 760px)').matches;
    const portraitWidth = mobile ? stageWidth : Math.min(stageHeight * .82 * portraitAspect, stageWidth * .88);
    const portraitHeight = portraitWidth / portraitAspect;
    const portraitCenterX = stageRect ? (stageRect.left + stageRect.width / 2 - canvasRect.left) / this.width : .75;
    const mobileArtworkHeight = stageRect ? stageRect.width / (this.image.naturalWidth / this.image.naturalHeight) : 0;
    const portraitCenterY = stageRect
      ? (canvasRect.bottom - (mobile ? stageRect.bottom - mobileArtworkHeight / 2 : stageRect.top + stageRect.height / 2)) / this.height
      : .5;
    const portraitOffsetX = (portraitCenterX - .5) * viewWidth;
    const portraitOffsetY = (portraitCenterY - .5) * viewHeight;
    const count = this.targetCount;
    const cols = Math.ceil(Math.sqrt(count * portraitAspect));
    const rows = Math.ceil(count / cols);
    this.sampleCanvas.width = cols;
    this.sampleCanvas.height = rows;
    this.sampleContext.drawImage(this.image, this.sourceX, this.sourceY, sourceWidth, sourceHeight, 0, 0, cols, rows);
    const pixels = this.sampleContext.getImageData(0, 0, cols, rows).data;
    const positions: number[] = [];
    const crowdPositions: number[] = [];
    const targets: number[] = [];
    const crowdColors: number[] = [];
    const portraitColors: number[] = [];
    const phases: number[] = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const i = (row * cols + col) * 4;
        if (pixels[i + 3] < 24) continue;
        const red = pixels[i], green = pixels[i + 1], blue = pixels[i + 2];
        const x = (col / Math.max(1, cols - 1) - .5) * portraitWidth + portraitOffsetX;
        const y = (.5 - row / Math.max(1, rows - 1)) * portraitHeight + portraitOffsetY;
        targets.push(x, y, 0);
        const sampleIndex = Math.floor(Math.random() * this.crowdSamples.length);
        const crowdSample = this.crowdSamples[sampleIndex];
        const crowdPoint = this.crowdPoint(crowdSample, viewWidth, viewHeight);
        crowdPositions.push(crowdPoint.x, crowdPoint.y, crowdPoint.z);
        positions.push(crowdPoint.x, crowdPoint.y - viewHeight * (.025 + Math.random() * .04), crowdPoint.z);
        const color = new THREE.Color().setRGB(red / 255, green / 255, blue / 255, THREE.SRGBColorSpace);
        portraitColors.push(color.r, color.g, color.b);
        const crowdColor = new THREE.Color().setRGB(
          crowdSample.red / 255,
          crowdSample.green / 255,
          crowdSample.blue / 255,
          THREE.SRGBColorSpace
        );
        crowdColors.push(crowdColor.r, crowdColor.g, crowdColor.b);
        phases.push(Math.random() * Math.PI * 2);
      }
    }

    this.starts = new Float32Array(positions);
    this.crowdPositions = new Float32Array(crowdPositions);
    this.targets = new Float32Array(targets);
    this.phases = new Float32Array(phases);
    this.crowdColors = new Float32Array(crowdColors);
    this.portraitColors = new Float32Array(portraitColors);
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(this.starts.slice(), 3).setUsage(THREE.DynamicDrawUsage));
    geometry.setAttribute('color', new THREE.BufferAttribute(this.crowdColors.slice(), 3).setUsage(THREE.DynamicDrawUsage));
    this.particleTexture?.dispose();
    this.particleTexture = this.createParticleTexture();
    const material = new THREE.PointsMaterial({
      size: 1.8,
      sizeAttenuation: true,
      vertexColors: true,
      map: this.particleTexture,
      transparent: true,
      alphaTest: .025,
      opacity: .96,
      depthWrite: false
    });
    this.geometry = geometry;
    this.material = material;
    this.points = new THREE.Points(geometry, material);
    this.scene.add(this.points);
  }

  private createParticleTexture(): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const context = canvas.getContext('2d')!;
    const glow = context.createRadialGradient(16, 16, 1, 16, 16, 16);
    glow.addColorStop(0, 'rgba(255,255,255,1)');
    glow.addColorStop(.3, 'rgba(255,255,255,1)');
    glow.addColorStop(.52, 'rgba(255,255,255,.65)');
    glow.addColorStop(1, 'rgba(255,255,255,0)');
    context.fillStyle = glow;
    context.fillRect(0, 0, 32, 32);
    return new THREE.CanvasTexture(canvas);
  }

  /** Distribute the source particles across the blue and red crowd strip at the base of the hero. */
  private crowdPoint(sample: CrowdSample, viewWidth: number, viewHeight: number): { x: number; y: number; z: number } {
    return {
      x: (sample.x - .5) * viewWidth * .98,
      y: -viewHeight * .49 + (1 - sample.y) * viewHeight * .3,
      z: 0
    };
  }

  private start(): void {
    if (this.raf || !this.renderer || !this.scene || !this.camera || !this.visible || !this.imageReady || !this.geometry || !this.material) return;
    const draw = (now: number) => {
      this.raf = 0;
      if (!this.visible || !this.renderer || !this.scene || !this.camera || !this.geometry || !this.material) return;
      const elapsed = now - this.startTime;
      const form = this.reducedMotion.matches ? 1 : Math.max(0, Math.min(1, (elapsed - 1450) / 2600));
      const formEase = form * form * (3 - 2 * form);
      const dissolve = this.reducedMotion.matches ? 0 : Math.sin(elapsed / 8200) * .025;
      const parallax = this.reducedMotion.matches || this.pointer.x < -500 ? 0 : 1;
      const px = parallax ? (this.pointer.x / this.width - .5) : 0;
      const py = parallax ? (this.pointer.y / this.height - .5) : 0;
      const positions = this.geometry.getAttribute('position') as THREE.BufferAttribute;
      const values = positions.array as Float32Array;
      const colors = this.geometry.getAttribute('color') as THREE.BufferAttribute;
      const colorValues = colors.array as Float32Array;
      for (let i = 0; i < this.targets.length; i += 3) {
        const particle = i / 3;
        const delay = this.reducedMotion.matches ? 0 : (this.phases[particle] / (Math.PI * 2)) * .22;
        const personPop = this.reducedMotion.matches ? 1 : Math.min(1, Math.max(0, (elapsed / 1050) - delay));
        const rise = 1 - Math.pow(1 - personPop, 3);
        const depth = 0;
        const shiftX = px * .16;
        const shiftY = -py * .12;
        const wobble = Math.sin(elapsed * .001 + i) * dissolve;
        const crowdX = this.starts[i] + (this.crowdPositions[i] - this.starts[i]) * rise;
        const crowdY = this.starts[i + 1] + (this.crowdPositions[i + 1] - this.starts[i + 1]) * rise;
        const crowdZ = this.starts[i + 2] + (this.crowdPositions[i + 2] - this.starts[i + 2]) * rise;
        const targetX = crowdX + (this.targets[i] + shiftX - crowdX) * formEase + wobble;
        const targetY = crowdY + (this.targets[i + 1] + shiftY - crowdY) * formEase + wobble;
        const targetZ = crowdZ + (depth - crowdZ) * formEase;
        values[i] += (targetX - values[i]) * .12;
        values[i + 1] += (targetY - values[i + 1]) * .12;
        values[i + 2] += (targetZ - values[i + 2]) * .12;
        if (formEase < 1) {
          colorValues[i] = this.crowdColors[i] + (this.portraitColors[i] - this.crowdColors[i]) * formEase;
          colorValues[i + 1] = this.crowdColors[i + 1] + (this.portraitColors[i + 1] - this.crowdColors[i + 1]) * formEase;
          colorValues[i + 2] = this.crowdColors[i + 2] + (this.portraitColors[i + 2] - this.crowdColors[i + 2]) * formEase;
        }
      }
      positions.needsUpdate = true;
      if (formEase < 1) colors.needsUpdate = true;
      this.camera.lookAt(0, 0, 0);
      this.renderer.render(this.scene, this.camera);
      if (formEase >= 1 && !this.hasFormed) {
        this.hasFormed = true;
        this.hooks.onFormed();
      }
      if (!this.hasFormed) this.raf = requestAnimationFrame(draw);
    };
    this.raf = requestAnimationFrame(draw);
  }

  private readonly onPointerMove = (event: PointerEvent) => {
    const rect = this.canvas.getBoundingClientRect();
    this.pointer.x = event.clientX - rect.left;
    this.pointer.y = event.clientY - rect.top;
  };
  private readonly onPointerDown = (event: PointerEvent) => { this.pointer.down = true; this.onPointerMove(event); };
  private readonly onPointerUp = () => { this.pointer.down = false; };
  private readonly onPointerLeave = () => { this.pointer.x = -1000; this.pointer.y = -1000; this.pointer.down = false; };
  private readonly onVisibility = () => {
    this.visible = document.visibilityState === 'visible';
    if (this.visible) this.start(); else { cancelAnimationFrame(this.raf); this.raf = 0; }
  };
  private readonly onMotionChange = () => { if (!this.raf) this.start(); };

  destroy(): void {
    cancelAnimationFrame(this.raf);
    window.clearTimeout(this.resizeTimer);
    this.resizeObserver?.disconnect();
    this.canvas.removeEventListener('pointermove', this.onPointerMove);
    this.canvas.removeEventListener('pointerdown', this.onPointerDown);
    this.canvas.removeEventListener('pointerup', this.onPointerUp);
    this.canvas.removeEventListener('pointerleave', this.onPointerLeave);
    document.removeEventListener('visibilitychange', this.onVisibility);
    this.reducedMotion.removeEventListener('change', this.onMotionChange);
    this.geometry?.dispose();
    this.material?.dispose();
    this.particleTexture?.dispose();
    this.renderer?.dispose();
    this.image.onload = null;
    this.image.onerror = null;
    this.crowdImage.onload = null;
    this.crowdImage.onerror = null;
  }
}
