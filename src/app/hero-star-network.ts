import * as THREE from 'three';

export const HERO_ANIMATION_CONFIG = {
  desktopNetworkNodes: 48,
  mobileNetworkNodes: 30,
  lowPowerDesktopNetworkNodes: 28,
  lowPowerMobileNetworkNodes: 18,
  networkLinkDistance: 1.35,
  networkParallax: 0.045,
  maxPixelRatio: 1.5
} as const;

/** Lightweight interactive star network that complements the supplied portrait. */
export class HeroStarNetwork {
  private readonly pointer = { x: -1000, y: -1000 };
  private readonly reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  private readonly visibilityObserver = new IntersectionObserver((entries) => {
    this.inViewport = entries[0]?.isIntersecting ?? false;
    if (this.inViewport) this.start();
    else {
      cancelAnimationFrame(this.raf);
      this.raf = 0;
    }
  }, { threshold: 0.01 });
  private renderer?: THREE.WebGLRenderer;
  private scene?: THREE.Scene;
  private camera?: THREE.OrthographicCamera;
  private networkGroup?: THREE.Group;
  private networkGeometry?: THREE.BufferGeometry;
  private networkLineGeometry?: THREE.BufferGeometry;
  private networkStarGeometry?: THREE.BufferGeometry;
  private networkPointsMaterial?: THREE.PointsMaterial;
  private networkLineMaterial?: THREE.LineBasicMaterial;
  private networkStarMaterial?: THREE.LineBasicMaterial;
  private networkNodes: Array<{ x: number; y: number; z: number; baseX: number; baseY: number; phase: number }> = [];
  private networkEdges: Array<[number, number]> = [];
  private resizeObserver?: ResizeObserver;
  private inViewport = true;
  private visible = document.visibilityState === 'visible';
  private raf = 0;
  private resizeTimer = 0;
  private width = 0;
  private height = 0;
  private networkOpacity = 0;
  private networkTargetOpacity = 0;
  private starHandoff = 0;

  constructor(private readonly canvas: HTMLCanvasElement) {
    try {
      this.renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: false,
        powerPreference: 'high-performance',
        premultipliedAlpha: false
      });
    } catch (error) {
      console.error('Unable to initialize the hero star network; the supplied portrait remains visible.', error);
      return;
    }

    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.setClearColor(0x000000, 0);
    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(-3, 3, 3, -3, .1, 100);
    this.resizeObserver = new ResizeObserver(() => {
      window.clearTimeout(this.resizeTimer);
      this.resizeTimer = window.setTimeout(() => this.resize(), 100);
    });
    this.resizeObserver.observe(canvas);
    this.visibilityObserver.observe(canvas);
    canvas.addEventListener('pointermove', this.onPointerMove, { passive: true });
    canvas.addEventListener('pointerleave', this.onPointerLeave, { passive: true });
    document.addEventListener('visibilitychange', this.onVisibility);
    this.reducedMotion.addEventListener('change', this.onMotionChange);
    this.resize();
  }

  revealNetwork(): void {
    this.networkTargetOpacity = 1;
    this.start();
  }

  setStarHandoff(progress: number): void {
    this.starHandoff = Math.max(0, Math.min(1, progress));
  }

  private resize(): void {
    if (!this.renderer || !this.camera) return;
    const rect = this.canvas.getBoundingClientRect();
    this.width = Math.max(1, rect.width);
    this.height = Math.max(1, rect.height);
    const lowPower = ((navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8) <= 2
      || (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true;
    const pixelRatio = Math.min(window.devicePixelRatio || 1, lowPower ? 1 : HERO_ANIMATION_CONFIG.maxPixelRatio);
    this.renderer.setPixelRatio(pixelRatio);
    this.renderer.setSize(this.width, this.height, false);

    const viewHeight = 5.8;
    const viewWidth = viewHeight * this.width / this.height;
    this.camera.left = -viewWidth / 2;
    this.camera.right = viewWidth / 2;
    this.camera.top = viewHeight / 2;
    this.camera.bottom = -viewHeight / 2;
    this.camera.position.set(0, 0, 10);
    this.camera.lookAt(0, 0, 0);
    this.camera.updateProjectionMatrix();

    const hero = this.canvas.parentElement;
    const stage = hero?.querySelector<HTMLElement>('.portrait-stage');
    const mobile = window.matchMedia('(max-width: 760px)').matches;
    const artwork = mobile ? hero?.querySelector<HTMLImageElement>('.hero-artwork') : undefined;
    const target = artwork?.getBoundingClientRect();
    const stageBounds = stage?.getBoundingClientRect();
    const targetBounds = target && target.width && target.height ? target : stageBounds;
    const centerX = targetBounds
      ? ((targetBounds.left + targetBounds.width / 2 - rect.left) / this.width - .5) * viewWidth
      : viewWidth * .25;
    const centerY = targetBounds
      ? (.5 - (targetBounds.top + targetBounds.height / 2 - rect.top) / this.height) * viewHeight
      : 0;
    this.createConstellation(centerX, centerY, lowPower);
  }

  private createConstellation(centerX: number, centerY: number, lowPower: boolean): void {
    if (!this.scene) return;
    if (this.networkGroup) {
      this.scene.remove(this.networkGroup);
      this.networkGroup.clear();
    }
    this.networkGeometry?.dispose();
    this.networkLineGeometry?.dispose();
    this.networkStarGeometry?.dispose();
    this.networkPointsMaterial?.dispose();
    this.networkLineMaterial?.dispose();
    this.networkStarMaterial?.dispose();

    const mobile = window.matchMedia('(max-width: 760px)').matches;
    const outerRadius = mobile ? 0.42 : 0.5;
    const innerRadius = outerRadius * 0.43;
    const nodes: Array<{ x: number; y: number; z: number; baseX: number; baseY: number; phase: number }> = [];
    const starPoints: THREE.Vector3[] = [];
    for (let index = 0; index < 10; index++) {
      const angle = -Math.PI / 2 + index * Math.PI / 5;
      const radius = index % 2 === 0 ? outerRadius : innerRadius;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      starPoints.push(new THREE.Vector3(x, y, 0));
      nodes.push({ x, y, z: 0.01, baseX: x, baseY: y, phase: index * 0.7 });
    }

    const satellites = mobile
      ? lowPower ? HERO_ANIMATION_CONFIG.lowPowerMobileNetworkNodes : HERO_ANIMATION_CONFIG.mobileNetworkNodes
      : lowPower ? HERO_ANIMATION_CONFIG.lowPowerDesktopNetworkNodes : HERO_ANIMATION_CONFIG.desktopNetworkNodes;
    for (let index = 0; index < satellites; index++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = outerRadius + 0.32 + Math.random() * (mobile ? 0.82 : 1.1);
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      nodes.push({ x, y, z: Math.random() * 0.56 - 0.28, baseX: x, baseY: y, phase: Math.random() * Math.PI * 2 });
    }

    const edges: Array<[number, number]> = [];
    const edgeKeys = new Set<string>();
    for (let i = 0; i < nodes.length; i++) {
      const nearest: Array<{ index: number; distance: number }> = [];
      for (let j = 0; j < nodes.length; j++) {
        if (i === j) continue;
        const distance = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
        if (distance <= HERO_ANIMATION_CONFIG.networkLinkDistance) nearest.push({ index: j, distance });
      }
      nearest.sort((a, b) => a.distance - b.distance);
      for (const neighbor of nearest.slice(0, 2)) {
        const key = `${Math.min(i, neighbor.index)}:${Math.max(i, neighbor.index)}`;
        if (edgeKeys.has(key)) continue;
        edgeKeys.add(key);
        edges.push([i, neighbor.index]);
      }
    }

    this.networkNodes = nodes;
    this.networkEdges = edges;
    this.networkGroup = new THREE.Group();
    this.networkGroup.position.set(centerX, centerY, -0.55);
    this.networkGroup.visible = false;

    const pointPositions = new Float32Array(nodes.length * 3);
    const pointColors = new Float32Array(nodes.length * 3);
    nodes.forEach((node, index) => {
      pointPositions[index * 3] = node.x;
      pointPositions[index * 3 + 1] = node.y;
      pointPositions[index * 3 + 2] = node.z;
      const color = new THREE.Color(node.x < 0 ? '#55b5ff' : '#ff5268');
      pointColors[index * 3] = color.r;
      pointColors[index * 3 + 1] = color.g;
      pointColors[index * 3 + 2] = color.b;
    });

    this.networkGeometry = new THREE.BufferGeometry();
    this.networkGeometry.setAttribute('position', new THREE.BufferAttribute(pointPositions, 3).setUsage(THREE.DynamicDrawUsage));
    this.networkGeometry.setAttribute('color', new THREE.BufferAttribute(pointColors, 3));
    this.networkPointsMaterial = new THREE.PointsMaterial({
      size: mobile ? 3.2 : 4,
      vertexColors: true,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      sizeAttenuation: false
    });
    this.networkGroup.add(new THREE.Points(this.networkGeometry, this.networkPointsMaterial));

    const linePositions = new Float32Array(edges.length * 6);
    const lineColors = new Float32Array(edges.length * 6);
    edges.forEach(([from, to], index) => {
      [from, to].forEach((nodeIndex, end) => {
        const offset = index * 6 + end * 3;
        const color = new THREE.Color(nodes[nodeIndex].x < 0 ? '#2785df' : '#ed2a40');
        lineColors[offset] = color.r;
        lineColors[offset + 1] = color.g;
        lineColors[offset + 2] = color.b;
      });
    });
    this.networkLineGeometry = new THREE.BufferGeometry();
    this.networkLineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3).setUsage(THREE.DynamicDrawUsage));
    this.networkLineGeometry.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));
    this.networkLineMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0,
      depthWrite: false
    });
    this.networkGroup.add(new THREE.LineSegments(this.networkLineGeometry, this.networkLineMaterial));

    this.networkStarGeometry = new THREE.BufferGeometry().setFromPoints(starPoints);
    const starColors = new Float32Array(starPoints.length * 3);
    starPoints.forEach((point, index) => {
      const color = new THREE.Color(point.x < 0 ? '#65bfff' : '#ff5d70');
      starColors[index * 3] = color.r;
      starColors[index * 3 + 1] = color.g;
      starColors[index * 3 + 2] = color.b;
    });
    this.networkStarGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
    this.networkStarMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0,
      depthWrite: false
    });
    this.networkGroup.add(new THREE.LineLoop(this.networkStarGeometry, this.networkStarMaterial));
    this.scene.add(this.networkGroup);
  }

  private start(): void {
    if (this.raf || !this.renderer || !this.scene || !this.camera || !this.networkGroup || !this.visible || !this.inViewport) return;
    const draw = (now: number) => {
      this.raf = 0;
      if (!this.visible || !this.inViewport || !this.renderer || !this.scene || !this.camera || !this.networkGroup) return;
      this.updateConstellation(now);
      this.renderer.render(this.scene, this.camera);
      if (this.networkOpacity > 0.01 || this.networkTargetOpacity > 0.01) this.raf = requestAnimationFrame(draw);
    };
    this.raf = requestAnimationFrame(draw);
  }

  private updateConstellation(elapsed: number): void {
    const group = this.networkGroup;
    const nodes = this.networkNodes;
    const pointGeometry = this.networkGeometry;
    const lineGeometry = this.networkLineGeometry;
    const pointsMaterial = this.networkPointsMaterial;
    const lineMaterial = this.networkLineMaterial;
    const starMaterial = this.networkStarMaterial;
    if (!group || !pointGeometry || !lineGeometry || !pointsMaterial || !lineMaterial || !starMaterial) return;

    this.networkOpacity += (this.networkTargetOpacity - this.networkOpacity) * 0.08;
    group.visible = this.networkOpacity > 0.01;
    pointsMaterial.opacity = this.networkOpacity * 0.48;
    lineMaterial.opacity = this.networkOpacity * 0.22;
    starMaterial.opacity = this.networkOpacity * (1 - this.starHandoff) * 0.4;
    if (!group.visible) return;

    const viewHeight = 5.8;
    const viewWidth = viewHeight * this.width / Math.max(this.height, 1);
    const pointerX = this.pointer.x < -500
      ? Number.POSITIVE_INFINITY
      : (this.pointer.x / this.width - 0.5) * viewWidth - group.position.x;
    const pointerY = this.pointer.y < -500
      ? Number.POSITIVE_INFINITY
      : (0.5 - this.pointer.y / this.height) * viewHeight - group.position.y;
    const parallaxX = this.reducedMotion.matches || this.pointer.x < -500 ? 0 : (this.pointer.x / this.width - 0.5) * HERO_ANIMATION_CONFIG.networkParallax;
    const parallaxY = this.reducedMotion.matches || this.pointer.y < -500 ? 0 : (this.pointer.y / this.height - 0.5) * HERO_ANIMATION_CONFIG.networkParallax;
    group.rotation.y += (parallaxX - group.rotation.y) * 0.06;
    group.rotation.x += (parallaxY - group.rotation.x) * 0.06;
    const pointAttribute = pointGeometry.getAttribute('position') as THREE.BufferAttribute;
    const pointValues = pointAttribute.array as Float32Array;
    nodes.forEach((node, index) => {
      const dx = node.baseX - pointerX;
      const dy = node.baseY - pointerY;
      const distance = Math.hypot(dx, dy);
      const force = Number.isFinite(distance) ? Math.max(0, 1 - distance / 1.5) * 0.12 : 0;
      const drift = this.reducedMotion.matches ? 0 : Math.sin(elapsed * 0.0007 + node.phase) * 0.012;
      const pointerOffsetX = Number.isFinite(distance) && distance > 0 ? dx / distance * force : 0;
      const pointerOffsetY = Number.isFinite(distance) && distance > 0 ? dy / distance * force : 0;
      node.x += (node.baseX + pointerOffsetX + drift - node.x) * 0.12;
      node.y += (node.baseY + pointerOffsetY + drift - node.y) * 0.12;
      pointValues[index * 3] = node.x;
      pointValues[index * 3 + 1] = node.y;
    });
    pointAttribute.needsUpdate = true;

    const lineAttribute = lineGeometry.getAttribute('position') as THREE.BufferAttribute;
    const lineValues = lineAttribute.array as Float32Array;
    this.networkEdges.forEach(([from, to], index) => {
      const offset = index * 6;
      lineValues[offset] = nodes[from].x;
      lineValues[offset + 1] = nodes[from].y;
      lineValues[offset + 2] = nodes[from].z;
      lineValues[offset + 3] = nodes[to].x;
      lineValues[offset + 4] = nodes[to].y;
      lineValues[offset + 5] = nodes[to].z;
    });
    lineAttribute.needsUpdate = true;
  }

  private readonly onPointerMove = (event: PointerEvent) => {
    const rect = this.canvas.getBoundingClientRect();
    this.pointer.x = event.clientX - rect.left;
    this.pointer.y = event.clientY - rect.top;
  };
  private readonly onPointerLeave = () => { this.pointer.x = -1000; this.pointer.y = -1000; };
  private readonly onVisibility = () => {
    this.visible = document.visibilityState === 'visible';
    if (this.visible && this.inViewport) this.start();
    else {
      cancelAnimationFrame(this.raf);
      this.raf = 0;
    }
  };
  private readonly onMotionChange = () => { if (!this.raf) this.start(); };

  destroy(): void {
    cancelAnimationFrame(this.raf);
    window.clearTimeout(this.resizeTimer);
    this.resizeObserver?.disconnect();
    this.visibilityObserver.disconnect();
    this.canvas.removeEventListener('pointermove', this.onPointerMove);
    this.canvas.removeEventListener('pointerleave', this.onPointerLeave);
    document.removeEventListener('visibilitychange', this.onVisibility);
    this.reducedMotion.removeEventListener('change', this.onMotionChange);
    this.networkGroup?.clear();
    this.networkGeometry?.dispose();
    this.networkLineGeometry?.dispose();
    this.networkStarGeometry?.dispose();
    this.networkPointsMaterial?.dispose();
    this.networkLineMaterial?.dispose();
    this.networkStarMaterial?.dispose();
    this.renderer?.dispose();
  }
}
