import * as THREE from 'three';

/** Tunables. Distances are fractions of the portrait height unless noted. */
export const HERO_PORTRAIT_3D_CONFIG = {
  /** Relief depth of the bust (kept shallow so the likeness is never distorted). */
  depth: 0.11,
  /** Sideways parallax between the nearest and farthest parts, at full pointer deflection. */
  parallaxX: 0.045,
  parallaxY: 0.02,
  /** Small whole-bust rotation (radians) at full deflection, for a perspective cue. */
  rotateY: 0.07,
  rotateX: 0.035,
  depthMapWidth: 256,
  segments: { desktop: [120, 132], mobile: [72, 80] },
  maxPixelRatio: { desktop: 1.75, mobile: 2 }
} as const;

const VERTEX_SHADER = /* glsl */ `
  uniform sampler2D uDepth;
  uniform float uDepthScale;
  uniform vec2 uParallax;
  varying vec2 vUv;
  varying vec3 vPos;

  void main() {
    vUv = uv;
    float d = texture2D(uDepth, uv).r;
    vec3 p = position;
    p.z = d * uDepthScale;
    // Depth-driven parallax: near parts slide further than far parts, with no global distortion at rest.
    p.xy += (d - 0.35) * uParallax;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vPos = mv.xyz;
    gl_Position = projectionMatrix * mv;
  }
`;

const FRAGMENT_SHADER = /* glsl */ `
  uniform sampler2D uMap;
  uniform vec3 uBlue;
  uniform vec3 uRed;
  uniform float uRim;
  uniform float uShade;
  varying vec2 vUv;
  varying vec3 vPos;

  void main() {
    vec4 c = texture2D(uMap, vUv);
    vec3 n = normalize(cross(dFdx(vPos), dFdy(vPos)));
    if (n.z < 0.0) n = -n;
    float diffuse = dot(n, normalize(vec3(-0.35, 0.5, 0.8)));
    // The photograph already carries its own lighting; the relief only nudges it.
    float shade = 1.0 + uShade * (diffuse - 0.8);
    float rim = pow(1.0 - clamp(n.z, 0.0, 1.0), 2.4) * uRim;
    vec3 tint = mix(uBlue, uRed, smoothstep(0.25, 0.95, vUv.x));
    gl_FragColor = vec4(c.rgb * shade + tint * rim * c.a, c.a);
  }
`;

/**
 * Depth-relief "3D view" of the supplied portrait photograph.
 * The photo itself is the texture (nothing is generated or altered); a soft bust-shaped relief is derived from
 * its alpha cut-out so the portrait gains parallax, depth and brand-coloured rim light as the pointer moves.
 */
export class HeroPortrait3D {
  private readonly reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  private readonly mobileLayout = window.matchMedia('(max-width: 760px)');
  private readonly compactQuery = window.matchMedia('(max-width: 760px), (pointer: coarse)');
  private readonly clock = new THREE.Clock();
  private readonly pointer = { x: 0, y: 0, smoothX: 0, smoothY: 0 };
  private readonly scene = new THREE.Scene();
  private readonly camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -2000, 2000);
  private readonly resizeObserver = new ResizeObserver(() => this.resize());
  private readonly visibilityObserver = new IntersectionObserver((entries) => {
    this.inViewport = entries[0]?.isIntersecting ?? false;
    this.updateLoop();
  }, { threshold: 0.01 });

  private renderer?: THREE.WebGLRenderer;
  private material?: THREE.ShaderMaterial;
  private mesh?: THREE.Mesh;
  private pivot = new THREE.Group();
  private map?: THREE.Texture;
  private depthMap?: THREE.DataTexture;
  private aspect = 1;
  private raf = 0;
  private inViewport = true;
  private documentVisible = document.visibilityState === 'visible';
  private loaded = false;
  private shown = false;
  private destroyed = false;
  private fadeTimer = 0;
  private planeWidth = 1;
  private planeHeight = 1;

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly imageUrl: string,
    private readonly onShown: () => void
  ) {
    try {
      this.renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
    } catch (error) {
      console.error('Unable to initialise the 3D portrait; the supplied photograph remains visible.', error);
      return;
    }
    this.renderer.setClearColor(0x000000, 0);
    // Raw pass-through: texture bytes in, the same bytes out, so colours match the <img> exactly.
    this.renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
    this.scene.add(this.pivot);
    this.resizeObserver.observe(canvas);
    this.visibilityObserver.observe(canvas);
    window.addEventListener('pointermove', this.onPointerMove, { passive: true });
    window.addEventListener('pointerleave', this.onPointerLeave, { passive: true });
    document.addEventListener('visibilitychange', this.onVisibility);
    canvas.addEventListener('webglcontextlost', this.onContextLost);
  }

  get ready(): boolean {
    return !!this.renderer && this.loaded && !this.destroyed;
  }

  async load(): Promise<void> {
    if (!this.renderer || this.destroyed) return;
    const map = await new THREE.TextureLoader().loadAsync(this.imageUrl);
    if (this.destroyed) {
      map.dispose();
      return;
    }
    map.colorSpace = THREE.NoColorSpace;
    map.anisotropy = Math.min(4, this.renderer.capabilities.getMaxAnisotropy());
    this.map = map;
    const image = map.image as HTMLImageElement;
    this.aspect = image.naturalWidth / image.naturalHeight;
    this.depthMap = this.buildDepthTexture(image);

    const config = HERO_PORTRAIT_3D_CONFIG;
    const [segX, segY] = this.compactQuery.matches ? config.segments.mobile : config.segments.desktop;
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        uMap: { value: map },
        uDepth: { value: this.depthMap },
        uDepthScale: { value: 0 },
        uParallax: { value: new THREE.Vector2() },
        uBlue: { value: new THREE.Color(0x2785df) },
        uRed: { value: new THREE.Color(0xed2a40) },
        uRim: { value: 0.32 },
        uShade: { value: 0.14 }
      },
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      transparent: true,
      depthWrite: false
    });
    this.mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, segX, segY), this.material);
    this.pivot.add(this.mesh);
    this.loaded = true;
    this.resize();
    this.updateLoop();
  }

  /** Cross-fades the relief portrait in over the flat photograph. */
  show(): void {
    if (!this.ready || this.shown) return;
    this.shown = true;
    this.canvas.classList.add('is-ready');
    // Once fully faded in, the flat <img> underneath is hidden (see .portrait-3d-active) to avoid double-blended edges.
    this.fadeTimer = window.setTimeout(() => this.onShown(), 700);
    this.updateLoop();
  }

  destroy(): void {
    this.destroyed = true;
    window.clearTimeout(this.fadeTimer);
    cancelAnimationFrame(this.raf);
    this.resizeObserver.disconnect();
    this.visibilityObserver.disconnect();
    window.removeEventListener('pointermove', this.onPointerMove);
    window.removeEventListener('pointerleave', this.onPointerLeave);
    document.removeEventListener('visibilitychange', this.onVisibility);
    this.canvas.removeEventListener('webglcontextlost', this.onContextLost);
    this.mesh?.geometry.dispose();
    this.material?.dispose();
    this.map?.dispose();
    this.depthMap?.dispose();
    this.renderer?.dispose();
    this.renderer = undefined;
  }

  /**
   * Bust-shaped relief from the photo's alpha cut-out: every scanline is treated as a rounded cross-section
   * (elliptical profile), then softened. Head and shoulders therefore share one gentle, believable volume.
   */
  private buildDepthTexture(image: HTMLImageElement): THREE.DataTexture {
    const width = HERO_PORTRAIT_3D_CONFIG.depthMapWidth;
    const height = Math.round(width / this.aspect);
    const scratch = document.createElement('canvas');
    scratch.width = width;
    scratch.height = height;
    const context = scratch.getContext('2d', { willReadFrequently: true });
    if (!context) throw new Error('2D canvas is required to derive the portrait relief.');
    context.drawImage(image, 0, 0, width, height);
    const pixels = context.getImageData(0, 0, width, height).data;

    let depth: Float32Array = new Float32Array(width * height);
    for (let y = 0; y < height; y++) {
      let x = 0;
      while (x < width) {
        if (pixels[(y * width + x) * 4 + 3] < 112) { x++; continue; }
        const start = x;
        while (x < width && pixels[(y * width + x) * 4 + 3] >= 112) x++;
        const length = x - start;
        if (length < 3) continue;
        for (let i = 0; i < length; i++) {
          const t = Math.min(i + 1, length - i) / (length / 2);
          depth[y * width + start + i] = Math.sqrt(Math.max(0, 1 - (1 - Math.min(t, 1)) ** 2));
        }
      }
    }

    depth = this.blur(this.blur(depth, width, height, 4), width, height, 3);

    // DataTexture rows run bottom-to-top, the image runs top-to-bottom.
    const bytes = new Uint8Array(width * height);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        bytes[(height - 1 - y) * width + x] = Math.round(Math.min(1, depth[y * width + x]) * 255);
      }
    }
    const texture = new THREE.DataTexture(bytes, width, height, THREE.RedFormat, THREE.UnsignedByteType);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.needsUpdate = true;
    return texture;
  }

  /** Separable box blur. */
  private blur(source: Float32Array, width: number, height: number, radius: number): Float32Array {
    const pass = (input: Float32Array, horizontal: boolean): Float32Array => {
      const output = new Float32Array(input.length);
      const outer = horizontal ? height : width;
      const inner = horizontal ? width : height;
      for (let a = 0; a < outer; a++) {
        let sum = 0;
        const at = (b: number): number => input[horizontal ? a * width + b : b * width + a];
        for (let b = -radius; b <= radius; b++) sum += at(Math.min(inner - 1, Math.max(0, b)));
        for (let b = 0; b < inner; b++) {
          output[horizontal ? a * width + b : b * width + a] = sum / (radius * 2 + 1);
          sum += at(Math.min(inner - 1, b + radius + 1)) - at(Math.max(0, b - radius));
        }
      }
      return output;
    };
    return pass(pass(source, true), false);
  }

  private resize(): void {
    if (!this.renderer || this.destroyed) return;
    const rect = this.canvas.getBoundingClientRect();
    const width = Math.max(1, Math.round(rect.width));
    const height = Math.max(1, Math.round(rect.height));
    const limits = HERO_PORTRAIT_3D_CONFIG.maxPixelRatio;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, this.compactQuery.matches ? limits.mobile : limits.desktop));
    this.renderer.setSize(width, height, false);
    this.camera.left = -width / 2;
    this.camera.right = width / 2;
    this.camera.top = height / 2;
    this.camera.bottom = -height / 2;
    this.camera.updateProjectionMatrix();

    // Same placement as the flat photo: object-fit: contain; object-position: right center.
    const scale = Math.min(width / this.aspect, height);
    this.planeHeight = scale;
    this.planeWidth = scale * this.aspect;
    const depthScale = HERO_PORTRAIT_3D_CONFIG.depth * this.planeHeight;
    // The pivot sits at the photo's centre, so tilting turns the bust about its middle depth.
    // The canvas is mirrored by CSS (`scale: -1 1`): desktop pins the photo to its left here (= right on screen), mobile centres it.
    this.pivot.position.set(this.mobileLayout.matches ? 0 : -width / 2 + this.planeWidth / 2, 0, 0);
    this.mesh?.scale.set(this.planeWidth, this.planeHeight, 1);
    this.mesh?.position.set(0, 0, -depthScale / 2);
    if (this.material) this.material.uniforms['uDepthScale']!.value = depthScale;
    this.draw(0);
  }

  private draw(time: number): void {
    if (!this.renderer || !this.material) return;
    const config = HERO_PORTRAIT_3D_CONFIG;
    const animated = !this.reducedMotion.matches;
    const sway = animated ? Math.sin(time * 0.5) * 0.28 : 0;
    // Mirrored canvas: negate x so the parallax still follows the pointer the same way on screen.
    const px = -((animated ? this.pointer.smoothX : 0) + sway);
    const py = animated ? this.pointer.smoothY * 0.7 + Math.sin(time * 0.37) * 0.1 : 0;

    // The parallax is applied in the plane's unit space, so convert from pixels.
    (this.material.uniforms['uParallax']!.value as THREE.Vector2).set(
      (px * config.parallaxX * this.planeHeight) / this.planeWidth,
      (-py * config.parallaxY * this.planeHeight) / this.planeHeight
    );
    this.pivot.rotation.set(py * config.rotateX, px * config.rotateY, 0);
    this.renderer.render(this.scene, this.camera);
  }

  private frame(): void {
    const dt = Math.min(this.clock.getDelta(), 0.05);
    const k = 1 - Math.exp(-dt * 4);
    this.pointer.smoothX += (this.pointer.x - this.pointer.smoothX) * k;
    this.pointer.smoothY += (this.pointer.y - this.pointer.smoothY) * k;
    this.draw(this.clock.elapsedTime);
  }

  private updateLoop = (): void => {
    const shouldRun = this.ready && this.shown && this.inViewport && this.documentVisible && !this.reducedMotion.matches;
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
