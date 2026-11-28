import * as THREE from 'three';

/** Tunables. World units are the headline scene's (camera 100 units away, about 53.6 units visible height). */
export const HERO_RIBBON_CONFIG = {
  /** Segments along each ribbon (desktop / mobile). */
  segments: { desktop: 280, mobile: 150 },
  /** Ribbon width at its widest, in units of 1/53.6 of the visible height. */
  width: 2.6,
  /** Depth swing: how far the ribbons pass in front of / behind the letters. */
  depth: 11,
  /** Seconds-scaled speed of the flowing motion. */
  speed: 0.55,
  red: 0xd9102c,
  blue: 0x1c63d6
} as const;

type RibbonSpec = { phase: number; yOffset: number; base: THREE.Color; other: THREE.Color };

/**
 * Two glossy red / blue ribbons that weave through the 3D headline and the portrait.
 * One set of animated geometry is shared by two renderers: the "back" scene (drawn behind the portrait, together with
 * the letters) shows the parts of the ribbons behind a clip plane, and the "front" scene (drawn above the portrait) shows
 * the parts in front of it, so the ribbons really do pass through both.
 */
export class HeroRibbons {
  private readonly specs: RibbonSpec[];
  private readonly geometries: THREE.BufferGeometry[] = [];
  private readonly segments: number;
  private readonly materials: THREE.MeshPhysicalMaterial[] = [];
  private readonly points: THREE.Vector3[];
  private readonly tangents: THREE.Vector3[];
  private readonly tmpA = new THREE.Vector3();
  private readonly tmpB = new THREE.Vector3();
  private readonly tmpColor = new THREE.Color();

  constructor(compact: boolean) {
    const config = HERO_RIBBON_CONFIG;
    const red = new THREE.Color(config.red);
    const blue = new THREE.Color(config.blue);
    this.segments = compact ? config.segments.mobile : config.segments.desktop;
    this.specs = [
      { phase: 0, yOffset: 0.035, base: red, other: blue },
      { phase: Math.PI * 0.92, yOffset: -0.035, base: blue, other: red }
    ];
    this.points = Array.from({ length: this.segments + 1 }, () => new THREE.Vector3());
    this.tangents = Array.from({ length: this.segments + 1 }, () => new THREE.Vector3());

    const count = (this.segments + 1) * 2;
    for (let k = 0; k < this.specs.length; k++) {
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(count * 3), 3));
      geometry.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(count * 3), 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(count * 3), 3));
      const index: number[] = [];
      for (let i = 0; i < this.segments; i++) {
        const a = i * 2;
        index.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
      }
      geometry.setIndex(index);
      this.geometries.push(geometry);
    }
  }

  /**
   * Builds a group of ribbon meshes that only draws the half-space chosen by `clipPlane` (world space; fragments with a
   * negative signed distance are clipped). Each scene needs its own group because the plane differs.
   */
  createGroup(clipPlane: THREE.Plane): THREE.Group {
    const group = new THREE.Group();
    this.geometries.forEach((geometry) => {
      const material = new THREE.MeshPhysicalMaterial({
        vertexColors: true,
        side: THREE.DoubleSide,
        metalness: 0.05,
        roughness: 0.42,
        clearcoat: 0.45,
        clearcoatRoughness: 0.2,
        envMapIntensity: 0.55,
        clippingPlanes: [clipPlane]
      });
      this.materials.push(material);
      const mesh = new THREE.Mesh(geometry, material);
      mesh.frustumCulled = false; // positions are rewritten every frame
      group.add(mesh);
    });
    return group;
  }

  /** Rewrites the ribbon geometry for `time` (seconds). `height` is the visible world height at the headline. */
  update(time: number, visibleWidth: number, visibleHeight: number): void {
    const config = HERO_RIBBON_CONFIG;
    const unit = visibleHeight / 53.6;
    const t = time * config.speed;
    const N = this.segments;

    for (let k = 0; k < this.specs.length; k++) {
      const spec = this.specs[k]!;
      // Centre line.
      for (let i = 0; i <= N; i++) {
        const u = i / N;
        const s = u * 2 - 1;
        const phase = spec.phase;
        this.points[i]!.set(
          visibleWidth * (0.62 * s + 0.1 * Math.sin(Math.PI * 2 * 1.6 * u + phase + 0.35 * t)),
          // The right-hand part sinks toward the shoulders so the ribbons never cover the face.
          visibleHeight * (0.17 * Math.sin(Math.PI * 2 * 1.15 * u + 1.7 * phase + 0.5 * t) + 0.07 * Math.sin(Math.PI * 2 * 2.4 * u - 0.8 * t) + spec.yOffset - 0.2 * THREE.MathUtils.smoothstep(s, -0.05, 0.45)),
          config.depth * unit * Math.sin(Math.PI * 2 * 1.1 * u + 2.1 * phase + t) + 1
        );
      }
      // Tangents (central differences).
      for (let i = 0; i <= N; i++) {
        const a = this.points[Math.max(0, i - 1)]!;
        const b = this.points[Math.min(N, i + 1)]!;
        this.tangents[i]!.subVectors(b, a).normalize();
      }

      const geometry = this.geometries[k]!;
      const position = geometry.getAttribute('position') as THREE.BufferAttribute;
      const color = geometry.getAttribute('color') as THREE.BufferAttribute;
      for (let i = 0; i <= N; i++) {
        const u = i / N;
        const tangent = this.tangents[i]!;
        // Two vectors perpendicular to the tangent, rotated by a slowly twisting angle: the ribbon turns as it flows.
        this.tmpA.set(0, 1, 0).cross(tangent);
        if (this.tmpA.lengthSq() < 1e-6) this.tmpA.set(1, 0, 0);
        this.tmpA.normalize();
        this.tmpB.copy(tangent).cross(this.tmpA).normalize();
        const theta = Math.PI * 2 * 1.3 * u + 0.8 * t + k * 1.9;
        const half = (config.width * unit * Math.pow(Math.sin(Math.PI * u), 0.55)) / 2;
        const wx = (this.tmpA.x * Math.cos(theta) + this.tmpB.x * Math.sin(theta)) * half;
        const wy = (this.tmpA.y * Math.cos(theta) + this.tmpB.y * Math.sin(theta)) * half;
        const wz = (this.tmpA.z * Math.cos(theta) + this.tmpB.z * Math.sin(theta)) * half;
        const p = this.points[i]!;
        position.setXYZ(i * 2, p.x - wx, p.y - wy, p.z - wz);
        position.setXYZ(i * 2 + 1, p.x + wx, p.y + wy, p.z + wz);

        // Colour flows along the ribbon between its own colour and the other one.
        const mix = 0.5 + 0.5 * Math.sin(Math.PI * 2 * 1.4 * u - t * 0.7 + k * Math.PI);
        // Dark-ish base: the scene's strong red/blue lights lift it, so the ribbons stay deeply saturated instead of washing out.
        this.tmpColor.copy(spec.base).lerp(spec.other, mix * 0.85).multiplyScalar(0.42);
        color.setXYZ(i * 2, this.tmpColor.r, this.tmpColor.g, this.tmpColor.b);
        color.setXYZ(i * 2 + 1, this.tmpColor.r, this.tmpColor.g, this.tmpColor.b);
      }
      position.needsUpdate = true;
      color.needsUpdate = true;
      geometry.computeVertexNormals();
    }
  }

  dispose(): void {
    this.geometries.forEach((geometry) => geometry.dispose());
    this.materials.forEach((material) => material.dispose());
  }
}
