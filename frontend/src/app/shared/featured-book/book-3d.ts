import { gsap } from 'gsap';
import * as THREE from 'three';

export interface FloatingBookOptions {
  /** Picture of the front cover (page 1 of the book). */
  coverUrl: string;
  /** Number of pages: a thicker book gets a thicker block of pages. */
  pages: number;
  title: string;
  /** Still picture only: no floating, no pointer, the cover opens without animation. */
  reduceMotion: boolean;
  /** Low-power device: lighter rendering. */
  lite: boolean;
}

const WIDTH = 1;
const BOARD = 0.014; // thickness of a cover board
const FOV = 30;
const BASE_ROTATION_Y = 0.46; // turned a little so the spine shows
const BASE_ROTATION_X = -0.07;

/**
 * A book that floats and turns a little towards the pointer. Clicking it opens the cover (the caller then shows the
 * reader). The cover picture is trimmed of its white page margin, so a black hard cover looks like one. Built from boxes:
 * two boards, a block of pages and a spine, all lit by a soft key light with a blue and a red rim light (the brand colours).
 */
export class FloatingBook3D {
  /** Called when the book is clicked or tapped. */
  onActivate: () => void = () => undefined;

  private readonly renderer: THREE.WebGLRenderer;
  private readonly scene = new THREE.Scene();
  private readonly camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 50);
  private readonly book = new THREE.Group();
  private readonly coverPivot = new THREE.Group();
  private readonly raycaster = new THREE.Raycaster();
  private readonly disposables: { dispose(): void }[] = [];

  private height = 1.3;
  /** Camera distance with the book closed, and with the cover swung open (it then needs more room to the left). */
  private distanceClosed = 4;
  private distanceOpen = 5;
  private frameId = 0;
  private visible = true;
  private paused = false;
  private destroyed = false;
  private hover = false;
  private hoverScale = 1;
  private readonly pointer = { x: 0, y: 0, ndcX: 2, ndcY: 2 };
  private readonly parallax = { x: 0, y: 0 };
  private down: { x: number; y: number } | null = null;
  private timeline: gsap.core.Timeline | null = null;
  private readonly intersection: IntersectionObserver;
  private readonly resizeObserver: ResizeObserver;

  /** What the animation changes (the render loop adds the floating on top). */
  private readonly pose = { rotY: BASE_ROTATION_Y, rotX: BASE_ROTATION_X, x: 0, y: 0, scale: 1, cover: 0, floating: 1 };
  isOpen = false;

  private constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly options: FloatingBookOptions
  ) {
    // throws when the browser cannot give us WebGL: the caller then shows the flat cover instead
    this.renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: !options.lite, powerPreference: 'high-performance' });
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, options.lite ? 1.25 : 2));

    this.intersection = new IntersectionObserver((entries) => {
      this.visible = entries.some((entry) => entry.isIntersecting);
      if (this.visible) this.start();
    });
    this.intersection.observe(canvas);
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(canvas);
  }

  static async create(canvas: HTMLCanvasElement, options: FloatingBookOptions): Promise<FloatingBook3D> {
    const book = new FloatingBook3D(canvas, options);
    try {
      await book.build();
    } catch (error) {
      book.destroy();
      throw error;
    }
    return book;
  }

  // ---- building the book ------------------------------------------------------------------------------------------------------
  private async build(): Promise<void> {
    const cover = await this.loadCover();
    this.height = cover.ratio * WIDTH;
    const maxAnisotropy = this.renderer.capabilities.getMaxAnisotropy();
    cover.texture.anisotropy = maxAnisotropy;
    this.track(cover.texture);

    const pagesThickness = Math.min(0.26, Math.max(0.05, 0.045 + this.options.pages * 0.00038));
    const total = pagesThickness + BOARD * 2;
    const H = this.height;

    const dark = this.material({ color: 0x0b0b0c, roughness: 0.62 });
    const endpaper = this.material({ color: 0xd8d0bd, roughness: 0.92 });
    const paper = this.material({ color: 0xf1ecde, roughness: 0.94 });
    const front = this.material({ map: cover.texture, roughness: 0.5 });
    const edgeAcross = this.material({ map: this.edgeTexture(true), roughness: 0.96 });
    const edgeAlong = this.material({ map: this.edgeTexture(false), roughness: 0.96 });
    const spine = this.material({ map: await this.spineTexture(total, H), roughness: 0.55 });

    // block of pages: inset from the fore-edge, top and bottom the way a real book is
    const blockW = WIDTH - 0.028;
    const blockH = H - 0.04;
    const block = new THREE.Mesh(this.box(blockW, blockH, pagesThickness), [edgeAcross, paper, edgeAlong, edgeAlong, paper, paper]);
    block.position.set(-WIDTH / 2 + blockW / 2 + 0.006, 0, 0);

    // back board
    const back = new THREE.Mesh(this.box(WIDTH, H, BOARD), dark);
    back.position.set(0, 0, -(pagesThickness / 2 + BOARD / 2));

    // front board hangs from a hinge at the spine so it can swing open
    this.coverPivot.position.set(-WIDTH / 2, 0, pagesThickness / 2 + BOARD / 2);
    const board = new THREE.Mesh(this.box(WIDTH, H, BOARD), [dark, dark, dark, dark, front, endpaper]);
    board.position.set(WIDTH / 2, 0, 0);
    this.coverPivot.add(board);

    const spineMesh = new THREE.Mesh(this.box(0.02, H, total), [dark, spine, dark, dark, dark, dark]);
    spineMesh.position.set(-WIDTH / 2 + 0.002, 0, 0);

    this.book.add(block, back, this.coverPivot, spineMesh);
    this.scene.add(this.book);

    this.scene.add(new THREE.AmbientLight(0xffffff, 0.85));
    const key = new THREE.DirectionalLight(0xf4f7fc, 2.1);
    key.position.set(-2.2, 2.8, 4);
    const blueRim = new THREE.DirectionalLight(0x4a9eeb, 1.5);
    blueRim.position.set(3.4, 1.2, -2);
    const redRim = new THREE.DirectionalLight(0xed2a40, 0.75);
    redRim.position.set(-3, -2, -1.5);
    this.scene.add(key, blueRim, redRim);

    this.resize();
    this.applyPose(0);
    this.renderer.render(this.scene, this.camera);

    if (!this.options.reduceMotion) {
      window.addEventListener('pointermove', this.onPointerMove, { passive: true });
      this.canvas.addEventListener('pointerdown', this.onPointerDown);
      this.canvas.addEventListener('pointerup', this.onPointerUp);
      this.canvas.addEventListener('pointerleave', this.onPointerLeave);
      document.addEventListener('visibilitychange', this.start);
    } else {
      this.canvas.addEventListener('pointerup', this.onPointerUp);
      this.canvas.addEventListener('pointerdown', this.onPointerDown);
    }
    this.start();
  }

  /** Loads the cover and trims the white margin around it (a black cover on a white page becomes a black board). */
  private async loadCover(): Promise<{ texture: THREE.Texture; ratio: number }> {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const element = new Image();
      element.crossOrigin = 'anonymous';
      element.onload = () => resolve(element);
      element.onerror = () => reject(new Error('The cover picture could not be loaded.'));
      element.src = this.options.coverUrl;
    });
    let source: HTMLImageElement | HTMLCanvasElement = image;
    let ratio = image.naturalHeight / image.naturalWidth;
    try {
      const trimmed = this.trim(image);
      if (trimmed) {
        source = trimmed;
        ratio = trimmed.height / trimmed.width;
      }
    } catch {
      /* a picture from another address that does not allow reading its pixels: use it as it is */
    }
    const texture = new THREE.Texture(source);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;
    return { texture, ratio };
  }

  private trim(image: HTMLImageElement): HTMLCanvasElement | null {
    const width = image.naturalWidth;
    const height = image.naturalHeight;
    const scratch = document.createElement('canvas');
    scratch.width = width;
    scratch.height = height;
    const context = scratch.getContext('2d', { willReadFrequently: true });
    if (!context) return null;
    context.drawImage(image, 0, 0);
    const { data } = context.getImageData(0, 0, width, height);
    const isInk = (x: number, y: number): boolean => {
      const i = (y * width + x) * 4;
      return data[i] < 236 || data[i + 1] < 236 || data[i + 2] < 236;
    };
    let top = 0;
    let bottom = height - 1;
    let left = 0;
    let right = width - 1;
    const rowHasInk = (y: number): boolean => {
      let count = 0;
      for (let x = 0; x < width; x += 2) if (isInk(x, y) && ++count > 3) return true;
      return false;
    };
    const columnHasInk = (x: number): boolean => {
      let count = 0;
      for (let y = 0; y < height; y += 2) if (isInk(x, y) && ++count > 3) return true;
      return false;
    };
    while (top < bottom && !rowHasInk(top)) top++;
    while (bottom > top && !rowHasInk(bottom)) bottom--;
    while (left < right && !columnHasInk(left)) left++;
    while (right > left && !columnHasInk(right)) right--;
    const cropW = right - left + 1;
    const cropH = bottom - top + 1;
    const margin = 1 - (cropW * cropH) / (width * height);
    if (cropW < width * 0.3 || cropH < height * 0.3 || margin < 0.04) return null; // nothing worth trimming
    const out = document.createElement('canvas');
    out.width = cropW;
    out.height = cropH;
    out.getContext('2d')?.drawImage(scratch, left, top, cropW, cropH, 0, 0, cropW, cropH);
    return out;
  }

  /** The edges of the page block: fine lines across the stack. */
  private edgeTexture(across: boolean): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const context = canvas.getContext('2d')!;
    context.fillStyle = '#efe9da';
    context.fillRect(0, 0, 128, 128);
    context.strokeStyle = 'rgba(110, 100, 80, 0.28)';
    context.lineWidth = 1;
    for (let i = 0; i < 128; i += 3) {
      context.beginPath();
      if (across) {
        context.moveTo(i + 0.5, 0);
        context.lineTo(i + 0.5, 128);
      } else {
        context.moveTo(0, i + 0.5);
        context.lineTo(128, i + 0.5);
      }
      context.stroke();
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    this.track(texture);
    return texture;
  }

  /** The spine: the title running down it, read from the top. */
  private async spineTexture(depth: number, height: number): Promise<THREE.CanvasTexture> {
    const scale = 900;
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(64, Math.round(depth * scale));
    canvas.height = Math.round(height * scale);
    const context = canvas.getContext('2d')!;
    try {
      await document.fonts?.load('700 48px "Noto Sans Tamil"', this.options.title);
    } catch {
      /* the fallback font is fine */
    }
    context.fillStyle = '#080808';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#ed2a40';
    context.fillRect(canvas.width * 0.18, canvas.height * 0.045, canvas.width * 0.64, 5);
    context.fillRect(canvas.width * 0.18, canvas.height * 0.955 - 5, canvas.width * 0.64, 5);
    context.save();
    context.translate(canvas.width / 2, canvas.height / 2);
    context.rotate(Math.PI / 2);
    let size = Math.min(canvas.width * 0.5, 92);
    context.font = `700 ${size}px "Noto Sans Tamil", "Montserrat", sans-serif`;
    const room = canvas.height * 0.78;
    const measured = context.measureText(this.options.title).width;
    if (measured > room) {
      size *= room / measured;
      context.font = `700 ${size}px "Noto Sans Tamil", "Montserrat", sans-serif`;
    }
    context.fillStyle = '#29a9e0';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(this.options.title, 0, 0);
    context.restore();
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
    this.track(texture);
    return texture;
  }

  private box(width: number, height: number, depth: number): THREE.BoxGeometry {
    const geometry = new THREE.BoxGeometry(width, height, depth);
    this.track(geometry);
    return geometry;
  }

  private material(parameters: THREE.MeshStandardMaterialParameters): THREE.MeshStandardMaterial {
    const material = new THREE.MeshStandardMaterial(parameters);
    this.track(material);
    return material;
  }

  private track<T extends { dispose(): void }>(item: T): T {
    this.disposables.push(item);
    return item;
  }

  // ---- opening and closing ------------------------------------------------------------------------------------------------------
  /** Brings the book forward and swings the cover open. Resolves when it is open. */
  open(): Promise<void> {
    this.timeline?.kill();
    this.isOpen = true;
    this.start();
    if (this.options.reduceMotion) {
      Object.assign(this.pose, { rotY: 0.1, rotX: -0.03, x: 0.22, scale: 1.1, cover: 2.2, floating: 0 });
      this.renderOnce();
      return Promise.resolve();
    }
    return new Promise((resolve) => {
      this.timeline = gsap
        .timeline({ onComplete: resolve })
        .to(this.pose, { floating: 0, rotY: 0.1, rotX: -0.03, x: 0.22, scale: 1.1, duration: 0.75, ease: 'power2.inOut' }, 0)
        .to(this.pose, { cover: 2.2, duration: 1.0, ease: 'power2.inOut' }, 0.45);
    });
  }

  /** Closes the cover and lets the book float again. */
  close(): Promise<void> {
    this.timeline?.kill();
    this.isOpen = false;
    this.start();
    if (this.options.reduceMotion) {
      Object.assign(this.pose, { rotY: BASE_ROTATION_Y, rotX: BASE_ROTATION_X, x: 0, scale: 1, cover: 0, floating: 1 });
      this.renderOnce();
      return Promise.resolve();
    }
    return new Promise((resolve) => {
      this.timeline = gsap
        .timeline({ onComplete: resolve })
        .to(this.pose, { cover: 0, duration: 0.8, ease: 'power2.inOut' }, 0)
        .to(this.pose, { floating: 1, rotY: BASE_ROTATION_Y, rotX: BASE_ROTATION_X, x: 0, scale: 1, duration: 0.8, ease: 'power2.inOut' }, 0.3);
    });
  }

  /** Stop drawing (for example while the reader covers the screen). */
  setPaused(paused: boolean): void {
    this.paused = paused;
    if (!paused) this.start();
  }

  // ---- input -----------------------------------------------------------------------------------------------------------------------
  private readonly onPointerMove = (event: PointerEvent): void => {
    if (event.pointerType === 'touch') return;
    const rect = this.canvas.getBoundingClientRect();
    // the book leans towards the pointer wherever it is on the page, strongest near the book
    this.pointer.x = Math.max(-1, Math.min(1, ((event.clientX - (rect.left + rect.width / 2)) / (window.innerWidth * 0.5)) * 1.4));
    this.pointer.y = Math.max(-1, Math.min(1, ((event.clientY - (rect.top + rect.height / 2)) / (window.innerHeight * 0.5)) * 1.4));
    this.pointer.ndcX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.ndcY = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
    const over = this.hits();
    if (over !== this.hover) {
      this.hover = over;
      this.canvas.classList.toggle('is-over', over && !this.isOpen);
    }
  };

  private readonly onPointerLeave = (): void => {
    this.hover = false;
    this.canvas.classList.remove('is-over');
  };

  private readonly onPointerDown = (event: PointerEvent): void => {
    this.down = { x: event.clientX, y: event.clientY };
  };

  private readonly onPointerUp = (event: PointerEvent): void => {
    const start = this.down;
    this.down = null;
    if (!start || this.isOpen) return;
    if (Math.hypot(event.clientX - start.x, event.clientY - start.y) > 10) return; // a drag, not a click
    const rect = this.canvas.getBoundingClientRect();
    this.pointer.ndcX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.ndcY = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
    if (this.hits()) this.onActivate();
  };

  private hits(): boolean {
    this.raycaster.setFromCamera(new THREE.Vector2(this.pointer.ndcX, this.pointer.ndcY), this.camera);
    return this.raycaster.intersectObject(this.book, true).length > 0;
  }

  // ---- drawing -------------------------------------------------------------------------------------------------------------------------
  private resize(): void {
    const width = Math.max(1, this.canvas.clientWidth);
    const height = Math.max(1, this.canvas.clientHeight);
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / height;
    // far enough that the book fits, whatever the shape of the space: closer when closed, further back when open
    const tan = Math.tan((FOV * Math.PI) / 360);
    const forHeight = (this.height * 1.4) / 2 / tan;
    const fit = (width: number): number => Math.max(forHeight, width / 2 / (tan * this.camera.aspect));
    this.distanceClosed = fit(WIDTH * 1.75);
    this.distanceOpen = Math.max(forHeight, fit(WIDTH * 2.6));
    this.camera.position.set(0.08, 0, this.distanceClosed);
    this.camera.lookAt(0, 0, 0);
    this.camera.updateProjectionMatrix();
    this.renderOnce();
  }

  private readonly start = (): void => {
    if (this.destroyed || this.options.reduceMotion || this.frameId || !this.visible || this.paused || document.hidden) return;
    this.frameId = requestAnimationFrame(this.frame);
  };

  private readonly frame = (now: number): void => {
    this.frameId = 0;
    if (this.destroyed || !this.visible || this.paused || document.hidden) return;
    this.parallax.x += (this.pointer.y * 0.16 - this.parallax.x) * 0.06;
    this.parallax.y += (this.pointer.x * 0.34 - this.parallax.y) * 0.06;
    this.hoverScale += ((this.hover && !this.isOpen ? 1.035 : 1) - this.hoverScale) * 0.12;
    this.applyPose(now / 1000);
    this.renderer.render(this.scene, this.camera);
    this.start();
  };

  private renderOnce(): void {
    if (this.destroyed) return;
    this.applyPose(0);
    this.renderer.render(this.scene, this.camera);
  }

  private applyPose(time: number): void {
    const pose = this.pose;
    const f = pose.floating;
    const still = this.options.reduceMotion;
    this.book.rotation.set(
      pose.rotX + (still ? 0 : f * (Math.sin(time * 0.7) * 0.02 + this.parallax.x)),
      pose.rotY + (still ? 0 : f * (Math.sin(time * 0.6) * 0.06 + this.parallax.y)),
      0
    );
    this.book.position.set(pose.x, pose.y + (still ? 0 : f * Math.sin(time * 0.9) * 0.035), 0);
    this.book.scale.setScalar(pose.scale * (still ? 1 : this.hoverScale));
    this.coverPivot.rotation.y = -pose.cover;
    // pull the camera back as the cover opens
    this.camera.position.z = this.distanceClosed + (this.distanceOpen - this.distanceClosed) * Math.min(1, pose.cover / 2.2);
  }

  destroy(): void {
    if (this.destroyed) return;
    this.destroyed = true;
    cancelAnimationFrame(this.frameId);
    this.timeline?.kill();
    this.intersection.disconnect();
    this.resizeObserver.disconnect();
    window.removeEventListener('pointermove', this.onPointerMove);
    document.removeEventListener('visibilitychange', this.start);
    this.canvas.removeEventListener('pointerdown', this.onPointerDown);
    this.canvas.removeEventListener('pointerup', this.onPointerUp);
    this.canvas.removeEventListener('pointerleave', this.onPointerLeave);
    this.canvas.classList.remove('is-over');
    this.disposables.forEach((item) => item.dispose());
    this.renderer.dispose();
    this.renderer.forceContextLoss();
  }
}
