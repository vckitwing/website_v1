import { gsap } from 'gsap';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';
import { HeroRibbons } from './hero-ribbons';
import { HERO_HEADLINE_OUTLINES, type HeadlineLanguage, type HeadlineLine } from './hero-headline-outlines';

export type HeroTheme = 'dark' | 'light';

/** Tunables, all in font units (1000 per em) unless noted. */
export const HERO_TYPOGRAPHY_CONFIG = {
  cameraFov: 30,
  /** Shadow softness (VSM blur radius in shadow-map texels; higher = blurrier). */
  shadowBlur: 18,
  cameraDistance: 100,
  extrudeDepth: 170,
  bevelThickness: 16,
  bevelSize: 11,
  /** Fraction of the viewport width the average headline line spans (>1 bleeds past the edges). */
  coverage: { desktop: { en: .84, ta: .78 }, mobile: { en: .8, ta: .8 } },
  /** Vertical offset of the stack as a fraction of the visible height (positive = up). */
  verticalOffset: { desktop: 0.17 },
  /** Horizontal offset as a fraction of the visible width (negative = left, away from the portrait). */
  horizontalOffset: { desktop: -0.05, mobile: 0 },
  /** Distance between baselines. */
  lineAdvance: { en: 980, ta: 1180 },
  baseRotation: { x: 0.13, y: -0.3, z: 0.05 },
  parallax: { rotateX: 0.12, rotateY: 0.2, shift: 0.035 },
  maxPixelRatio: { desktop: 1.75, mobile: 2 }
} as const;

type Palette = { face: number; side: number; shadow: number; envIntensity: number; exposure: number };

const PALETTES: Record<HeroTheme, Palette> = {
  // Graphite chrome: neutral grey metal; the colour comes from the red / blue ribbon lights reflecting in it.
  dark: { face: 0xc4cad4, side: 0x6a7482, shadow: 0x02060f, envIntensity: 1.15, exposure: 1.05 },
  light: { face: 0x39414f, side: 0x1d232d, shadow: 0x4b6283, envIntensity: .8, exposure: 1 }
};

type BuiltLine = { mesh: THREE.Mesh; bounds: HeadlineLine['bounds']; baseline: number };

/**
 * Monumental extruded graphite-chrome headline rendered with real 3D geometry, with red / blue ribbons weaving through
 * it and the portrait (see HeroRibbons).
 * Outlines are pre-shaped (HarfBuzz) so Tamil renders correctly; see tools/generate-typography-outlines.mjs.
 */
export class HeroTypography3D {
  private readonly reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  private readonly mobileLayout = window.matchMedia('(max-width: 760px)');
  private readonly compactQuery = window.matchMedia('(max-width: 760px), (pointer: coarse)');
  private readonly clock = new THREE.Clock();
  private readonly pointer = { x: 0, y: 0, smoothX: 0, smoothY: 0 };
  private readonly intro = { progress: 0, flip: 0 };
  private readonly visibilityObserver = new IntersectionObserver((entries) => {
    this.inViewport = entries[0]?.isIntersecting ?? false;
    this.updateLoop();
  }, { threshold: 0.01 });
  private readonly resizeObserver = new ResizeObserver(() => this.resize());
  // Satin finish (about 10% duller than the original glossy chrome): higher roughness, softer clear-coat.
  private readonly faceMaterial = new THREE.MeshPhysicalMaterial({ metalness: .9, roughness: .34, clearcoat: .8, clearcoatRoughness: .22 });
  private readonly sideMaterial = new THREE.MeshPhysicalMaterial({ metalness: .94, roughness: .46 });
  private readonly cache = new Map<HeadlineLanguage, { group: THREE.Group; geometries: THREE.BufferGeometry[]; lines: BuiltLine[] }>();

  private renderer?: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera(HERO_TYPOGRAPHY_CONFIG.cameraFov, 1, 1, 600);
  private stage = new THREE.Group();
  private keyLight = new THREE.DirectionalLight(0xdfeaff, 2.6);
  private redLight = new THREE.PointLight(0xed2a40, 0, 0, 2);
  private blueLight = new THREE.PointLight(0x2785df, 0, 0, 2);
  private shadowPlane?: THREE.Mesh;
  // Ribbons: the back group lives in the main scene (with the letters); the front group has its own renderer/canvas drawn
  // above the portrait. Both share one set of animated geometry.
  private ribbons?: HeroRibbons;
  private ribbonBack?: THREE.Group;
  private ribbonFront?: THREE.Group;
  private frontRenderer?: THREE.WebGLRenderer;
  private frontScene = new THREE.Scene();
  private frontEnvironment?: THREE.Texture;
  private frontLights: { key: THREE.DirectionalLight; red: THREE.PointLight; blue: THREE.PointLight } | undefined;
  private readonly backClip = new THREE.Plane(new THREE.Vector3(0, 0, -1), 8);
  private readonly frontClip = new THREE.Plane(new THREE.Vector3(0, 0, 1), -8);
  private environment?: THREE.Texture;
  private active?: { group: THREE.Group; lines: BuiltLine[] };
  private language: HeadlineLanguage;
  private theme: HeroTheme = 'dark';
  private raf = 0;
  private inViewport = true;
  private documentVisible = document.visibilityState === 'visible';
  private width = 0;
  private height = 0;
  private layoutScale = 1;
  private revealed = false;
  private destroyed = false;
  private swapping = false;
  private tween?: gsap.core.Tween | gsap.core.Timeline;

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly frontCanvas: HTMLCanvasElement | null,
    initialLanguage: HeadlineLanguage,
    theme: HeroTheme
  ) {
    this.language = initialLanguage;
    this.theme = theme;

    try {
      this.renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance'
      });
    } catch (error) {
      console.error('Unable to initialise the 3D hero headline; the hero remains usable without it.', error);
      return;
    }

    const renderer = this.renderer;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.setClearColor(0x000000, 0);
    renderer.localClippingEnabled = true;
    renderer.shadowMap.enabled = this.shadowsEnabled();
    // VSM is the shadow type whose blur radius actually works (PCFSoft ignores it), giving a very soft, blurry shadow.
    renderer.shadowMap.type = THREE.VSMShadowMap;

    // Studio reflections give the extruded metal its chrome-white look.
    const pmrem = new THREE.PMREMGenerator(renderer);
    this.environment = pmrem.fromScene(new RoomEnvironment(), .04).texture;
    pmrem.dispose();
    this.scene.environment = this.environment;

    this.camera.position.set(0, 0, HERO_TYPOGRAPHY_CONFIG.cameraDistance);
    this.scene.add(this.stage, this.keyLight, this.keyLight.target, this.redLight, this.blueLight);
    this.keyLight.castShadow = this.shadowsEnabled();
    this.keyLight.shadow.mapSize.set(this.compactQuery.matches ? 1024 : 2048, this.compactQuery.matches ? 1024 : 2048);
    this.keyLight.shadow.bias = -0.0005;
    this.keyLight.shadow.normalBias = 0.02;
    this.keyLight.shadow.radius = HERO_TYPOGRAPHY_CONFIG.shadowBlur;
    this.keyLight.shadow.blurSamples = 25;

    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(1, 1),
      new THREE.ShadowMaterial({ opacity: .55, transparent: true })
    );
    plane.receiveShadow = true;
    this.shadowPlane = plane;
    this.scene.add(plane);

    this.setUpRibbons();
    this.applyPalette();
    this.mount(this.language);
    this.resizeObserver.observe(canvas);
    this.visibilityObserver.observe(canvas);
    window.addEventListener('pointermove', this.onPointerMove, { passive: true });
    window.addEventListener('pointerleave', this.onPointerLeave, { passive: true });
    document.addEventListener('visibilitychange', this.onVisibility);
    canvas.addEventListener('webglcontextlost', this.onContextLost);
    this.reducedMotion.addEventListener('change', this.updateLoop);
    this.resize();
  }

  get ready(): boolean {
    return !!this.renderer && !this.destroyed;
  }

  /** Plays the entrance (or shows the final frame at once for reduced motion). */
  reveal(): void {
    if (!this.ready || this.revealed) return;
    this.revealed = true;
    this.canvas.classList.add('is-ready');
    this.frontCanvas?.classList.add('is-ready');
    this.tween?.kill();
    if (this.reducedMotion.matches) {
      this.intro.progress = 1;
      this.renderOnce();
      return;
    }
    this.intro.progress = 0;
    this.tween = gsap.to(this.intro, { progress: 1, duration: 2.1, ease: 'power3.out', onUpdate: () => this.renderOnce() });
    this.updateLoop();
  }

  setTheme(theme: HeroTheme): void {
    if (!this.ready || theme === this.theme) return;
    this.theme = theme;
    this.applyPalette();
    this.renderOnce();
  }

  setLanguage(language: HeadlineLanguage): void {
    if (!this.ready || language === this.language) return;
    this.language = language;
    if (!this.revealed || this.reducedMotion.matches) {
      this.mount(language);
      this.resize();
      return;
    }

    // Flip the slab edge-on, swap the text, flip it back.
    this.tween?.kill();
    this.swapping = true;
    const timeline = gsap.timeline({ onComplete: () => { this.swapping = false; } });
    timeline.to(this.intro, { flip: -1, duration: .38, ease: 'power2.in' });
    timeline.add(() => { this.mount(language); this.resize(); });
    timeline.set(this.intro, { flip: 1 });
    timeline.to(this.intro, { flip: 0, duration: .7, ease: 'back.out(1.25)' });
    this.tween = timeline;
  }

  destroy(): void {
    this.destroyed = true;
    this.tween?.kill();
    cancelAnimationFrame(this.raf);
    this.resizeObserver.disconnect();
    this.visibilityObserver.disconnect();
    window.removeEventListener('pointermove', this.onPointerMove);
    window.removeEventListener('pointerleave', this.onPointerLeave);
    document.removeEventListener('visibilitychange', this.onVisibility);
    this.canvas.removeEventListener('webglcontextlost', this.onContextLost);
    this.reducedMotion.removeEventListener('change', this.updateLoop);
    this.cache.forEach((entry) => entry.geometries.forEach((geometry) => geometry.dispose()));
    this.cache.clear();
    this.faceMaterial.dispose();
    this.sideMaterial.dispose();
    this.shadowPlane?.geometry.dispose();
    (this.shadowPlane?.material as THREE.Material | undefined)?.dispose();
    this.environment?.dispose();
    this.renderer?.dispose();
    this.renderer = undefined;
    this.ribbons?.dispose();
    this.frontEnvironment?.dispose();
    this.frontRenderer?.dispose();
    this.frontRenderer = undefined;
  }

  private setUpRibbons(): void {
    if (!this.renderer) return;
    this.ribbons = new HeroRibbons(this.compactQuery.matches);
    this.ribbonBack = this.ribbons.createGroup(this.backClip);
    this.scene.add(this.ribbonBack);

    if (!this.frontCanvas) return;
    try {
      this.frontRenderer = new THREE.WebGLRenderer({
        canvas: this.frontCanvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance'
      });
    } catch (error) {
      console.error('Unable to initialise the front ribbon layer; the ribbons stay behind the portrait.', error);
      return;
    }
    const front = this.frontRenderer;
    front.outputColorSpace = THREE.SRGBColorSpace;
    front.toneMapping = THREE.ACESFilmicToneMapping;
    front.setClearColor(0x000000, 0);
    front.localClippingEnabled = true;
    // Textures are per-renderer, so the front layer builds its own studio environment.
    const pmrem = new THREE.PMREMGenerator(front);
    this.frontEnvironment = pmrem.fromScene(new RoomEnvironment(), .04).texture;
    pmrem.dispose();
    this.frontScene.environment = this.frontEnvironment;
    const key = new THREE.DirectionalLight(0xdfeaff, 2.6);
    const red = new THREE.PointLight(0xed2a40, 0, 0, 2);
    const blue = new THREE.PointLight(0x2785df, 0, 0, 2);
    this.frontLights = { key, red, blue };
    this.ribbonFront = this.ribbons.createGroup(this.frontClip);
    this.frontScene.add(this.ribbonFront, key, red, blue);
  }

  private shadowsEnabled(): boolean {
    return !this.compactQuery.matches || (navigator.hardwareConcurrency ?? 4) > 4;
  }

  private applyPalette(): void {
    const palette = PALETTES[this.theme];
    this.faceMaterial.color.setHex(palette.face);
    this.sideMaterial.color.setHex(palette.side);
    this.faceMaterial.envMapIntensity = palette.envIntensity;
    this.sideMaterial.envMapIntensity = palette.envIntensity * .85;
    (this.shadowPlane?.material as THREE.ShadowMaterial | undefined)?.color.setHex(palette.shadow);
    if (this.renderer) this.renderer.toneMappingExposure = palette.exposure;
    const dark = this.theme === 'dark';
    this.keyLight.color.setHex(dark ? 0xdfeaff : 0xf4f7fc);
    this.keyLight.intensity = dark ? 2.6 : 2.1;
    this.redLight.intensity = dark ? 16000 : 5000;
    this.blueLight.intensity = dark ? 9000 : 5000;
  }

  private mount(language: HeadlineLanguage): void {
    if (this.active) this.stage.remove(this.active.group);
    let entry = this.cache.get(language);
    if (!entry) {
      entry = this.build(language);
      this.cache.set(language, entry);
    }
    this.stage.add(entry.group);
    this.active = entry;
    this.canvas.setAttribute('lang', language);
  }

  private build(language: HeadlineLanguage): { group: THREE.Group; geometries: THREE.BufferGeometry[]; lines: BuiltLine[] } {
    const config = HERO_TYPOGRAPHY_CONFIG;
    const compact = this.compactQuery.matches;
    const loader = new SVGLoader();
    const group = new THREE.Group();
    const geometries: THREE.BufferGeometry[] = [];
    const lines: BuiltLine[] = [];

    HERO_HEADLINE_OUTLINES[language].forEach((line, index) => {
      const svg = `<svg xmlns="http://www.w3.org/2000/svg"><path d="${line.path}"/></svg>`;
      const shapes = loader.parse(svg).paths.flatMap((path) => SVGLoader.createShapes(path));
      const geometry = new THREE.ExtrudeGeometry(shapes, {
        depth: config.extrudeDepth,
        curveSegments: compact ? 4 : 8,
        bevelEnabled: true,
        bevelThickness: config.bevelThickness,
        bevelSize: config.bevelSize,
        bevelOffset: 0,
        bevelSegments: compact ? 2 : 4
      });
      geometries.push(geometry);

      const mesh = new THREE.Mesh(geometry, [this.faceMaterial, this.sideMaterial]);
      const [minX, , maxX] = line.bounds;
      const baseline = -index * config.lineAdvance[language];
      // Outlines are y-down: flip, centre horizontally, and centre the slab's depth on z = 0.
      mesh.scale.set(1, -1, 1);
      mesh.position.set(-(minX + maxX) / 2, baseline, -config.extrudeDepth / 2 + index * 70);
      mesh.castShadow = true;
      group.add(mesh);
      lines.push({ mesh, bounds: line.bounds, baseline });
    });

    return { group, geometries, lines };
  }

  private resize(): void {
    if (!this.renderer || this.destroyed) return;
    const rect = this.canvas.getBoundingClientRect();
    const width = Math.max(1, Math.round(rect.width));
    const height = Math.max(1, Math.round(rect.height));
    this.width = width;
    this.height = height;
    const compact = this.compactQuery.matches;
    const limits = HERO_TYPOGRAPHY_CONFIG.maxPixelRatio;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, compact ? limits.mobile : limits.desktop));
    this.renderer.setSize(width, height, false);
    this.frontRenderer?.setPixelRatio(Math.min(window.devicePixelRatio || 1, compact ? limits.mobile : limits.desktop));
    this.frontRenderer?.setSize(width, height, false);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.layout();
    this.renderOnce();
  }

  /**
   * Scales the stack. Desktop: monumental, bleeding past the viewport edges. Mobile: the canvas is its own block at the
   * top of the hero, and the text is fitted *inside* it (longest line = `coverage` of the width) so no edge is cut.
   */
  private layout(): void {
    if (!this.active) return;
    const config = HERO_TYPOGRAPHY_CONFIG;
    const mobile = this.mobileLayout.matches;
    const language = this.language;
    const visibleHeight = 2 * config.cameraDistance * Math.tan(THREE.MathUtils.degToRad(config.cameraFov / 2));
    const visibleWidth = visibleHeight * this.camera.aspect;
    const lines = this.active.lines;

    const lineWidths = lines.map((line) => line.bounds[2] - line.bounds[0]);
    const referenceWidth = mobile ? Math.max(...lineWidths) : lineWidths.reduce((sum, width) => sum + width, 0) / lines.length;
    const coverage = (mobile ? config.coverage.mobile : config.coverage.desktop)[language];
    const stackHeight = Math.max(...lines.map((line) => line.baseline - line.bounds[1])) - Math.min(...lines.map((line) => line.baseline - line.bounds[3]));
    const scale = Math.min((coverage * visibleWidth) / referenceWidth, (visibleHeight * (mobile ? .78 : .6)) / stackHeight);
    this.layoutScale = scale;

    const top = Math.max(...lines.map((line) => line.baseline - line.bounds[1]));
    const bottom = Math.min(...lines.map((line) => line.baseline - line.bounds[3]));
    this.stage.scale.setScalar(scale);
    const centerLocal = ((top + bottom) / 2) * scale;
    const targetCenter = mobile ? 0 : visibleHeight * config.verticalOffset.desktop;
    this.stage.userData['centerY'] = targetCenter - centerLocal;
    this.stage.userData['visibleWidth'] = visibleWidth;
    this.stage.userData['centerX'] = visibleWidth * (mobile ? config.horizontalOffset.mobile : config.horizontalOffset.desktop);

    const depth = config.extrudeDepth * scale;
    this.keyLight.position.set(-visibleWidth * .35, visibleHeight * .55, 70);
    this.keyLight.target.position.set(0, 0, 0);
    const half = Math.max(visibleWidth, visibleHeight) * .9;
    const shadowCamera = this.keyLight.shadow.camera;
    shadowCamera.left = -half;
    shadowCamera.right = half;
    shadowCamera.top = half;
    shadowCamera.bottom = -half;
    shadowCamera.near = 1;
    shadowCamera.far = 400;
    shadowCamera.updateProjectionMatrix();
    this.redLight.position.set(visibleWidth * .46, -visibleHeight * .3, 28);
    this.blueLight.position.set(-visibleWidth * .5, visibleHeight * .25, 34);
    this.stage.userData['visibleHeight'] = visibleHeight;

    // Ribbon parts behind this plane are drawn with the letters (behind the portrait); parts in front of it are drawn in
    // the front layer, above the portrait. It sits just in front of the letters.
    const clipZ = depth + 3.5;
    this.backClip.constant = clipZ;
    this.frontClip.constant = -clipZ;

    if (this.shadowPlane) {
      this.shadowPlane.position.set(0, 0, -depth * 1.4 - 1.5);
      this.shadowPlane.scale.set(visibleWidth * 4, visibleHeight * 4, 1);
    }
  }

  private frame(): void {
    const dt = Math.min(this.clock.getDelta(), .05);
    const k = 1 - Math.exp(-dt * 5);
    this.pointer.smoothX += (this.pointer.x - this.pointer.smoothX) * k;
    this.pointer.smoothY += (this.pointer.y - this.pointer.smoothY) * k;
    this.draw(this.clock.elapsedTime);
  }

  private renderOnce(): void {
    if (!this.renderer || this.destroyed) return;
    // While the loop is running it already redraws every frame.
    if (!this.raf) this.draw(this.reducedMotion.matches ? 0 : this.clock.elapsedTime);
  }

  private draw(time: number): void {
    if (!this.renderer || !this.active) return;
    const config = HERO_TYPOGRAPHY_CONFIG;
    const animated = !this.reducedMotion.matches;
    const visibleWidth = (this.stage.userData['visibleWidth'] as number | undefined) ?? 1;
    const centerY = (this.stage.userData['centerY'] as number | undefined) ?? 0;
    const centerX = (this.stage.userData['centerX'] as number | undefined) ?? 0;
    const entrance = 1 - this.intro.progress;
    const floatY = animated ? Math.sin(time * .7) * visibleWidth * .008 : 0;
    const sway = animated ? Math.sin(time * .45) * .025 : 0;
    const px = animated ? this.pointer.smoothX : 0;
    const py = animated ? this.pointer.smoothY : 0;

    this.stage.rotation.set(
      config.baseRotation.x - py * config.parallax.rotateX + this.intro.flip * 1.45 + entrance * .5,
      config.baseRotation.y + px * config.parallax.rotateY + sway + entrance * -.9,
      config.baseRotation.z + (animated ? Math.sin(time * .35) * .008 : 0)
    );
    this.stage.position.set(
      centerX + px * visibleWidth * config.parallax.shift * (this.mobileLayout.matches ? 0.35 : 1),
      centerY + floatY + py * visibleWidth * .012,
      entrance * -visibleWidth * .5
    );

    // Lights drift slightly with the pointer so the metal catches light as it moves.
    this.redLight.position.x += ((visibleWidth * (.46 + px * .1)) - this.redLight.position.x) * .1;
    this.blueLight.position.x += ((-visibleWidth * (.5 - px * .08)) - this.blueLight.position.x) * .1;

    this.renderer.render(this.scene, this.camera);
    this.drawRibbons(animated ? time : 0, px, py, visibleWidth);
  }

  private drawRibbons(time: number, px: number, py: number, visibleWidth: number): void {
    if (!this.ribbons || !this.ribbonBack) return;
    const visibleHeight = (this.stage.userData['visibleHeight'] as number | undefined) ?? 53.6;
    const mobile = this.mobileLayout.matches;
    this.ribbons.update(time, visibleWidth, visibleHeight);
    // The ribbons move a little more than the letters with the pointer, which adds depth.
    const groups = [this.ribbonBack, this.ribbonFront].filter((group): group is THREE.Group => !!group);
    for (const group of groups) {
      group.rotation.set(-py * 0.1, px * 0.16, 0);
      group.position.set(px * visibleWidth * (mobile ? 0.02 : 0.05), -py * visibleHeight * 0.02, 0);
    }
    if (this.frontRenderer && this.frontLights) {
      const { key, red, blue } = this.frontLights;
      const dark = this.theme === 'dark';
      key.position.copy(this.keyLight.position);
      key.intensity = dark ? 2.6 : 2.1;
      red.position.copy(this.redLight.position);
      red.intensity = this.redLight.intensity;
      blue.position.copy(this.blueLight.position);
      blue.intensity = this.blueLight.intensity;
      this.frontRenderer.toneMappingExposure = this.renderer?.toneMappingExposure ?? 1;
      this.frontRenderer.render(this.frontScene, this.camera);
    }
  }

  private updateLoop = (): void => {
    const shouldRun = this.ready && this.inViewport && this.documentVisible && !this.reducedMotion.matches && this.revealed;
    if (shouldRun && !this.raf) {
      this.clock.getDelta();
      const tick = (): void => {
        if (!this.raf) return;
        this.frame();
        this.raf = requestAnimationFrame(tick);
      };
      this.raf = requestAnimationFrame(tick);
    } else if (!shouldRun && this.raf) {
      cancelAnimationFrame(this.raf);
      this.raf = 0;
    }
    if (!shouldRun) this.renderOnce();
  };

  private onPointerMove = (event: PointerEvent): void => {
    this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.pointer.y = (event.clientY / window.innerHeight) * 2 - 1;
  };

  private onPointerLeave = (): void => {
    this.pointer.x = 0;
    this.pointer.y = 0;
  };

  private onVisibility = (): void => {
    this.documentVisible = document.visibilityState === 'visible';
    this.updateLoop();
  };

  private onContextLost = (event: Event): void => {
    event.preventDefault();
    cancelAnimationFrame(this.raf);
    this.raf = 0;
  };
}
