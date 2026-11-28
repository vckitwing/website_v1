#!/usr/bin/env node
/**
 * Traces the supplied signature photograph into single-line SVG strokes (Node only).
 *
 * The signature is NOT redrawn. Two things are produced from the source bitmap:
 *  1. FILL    - the exact ink shape: the bitmap is upscaled, thresholded and its outline traced into one SVG
 *               path (transparent background). This is what the viewer sees, so the handwriting is preserved.
 *  2. STROKES - a one-pixel centre line (Zhang-Suen thinning) walked into pen strokes, joined where a pen
 *               would continue, ordered like real writing (main signature, underline, remaining marks), each with
 *               a width that covers the ink. They are animated with stroke-dasharray / stroke-dashoffset
 *               inside an SVG mask, so the ink is revealed as if it were being written.
 *
 * Usage (from frontend/):  npm run trace:signature
 * Input : assets/signature/signature-source.png
 * Output: src/app/shared/handwritten-signature/signature-strokes.ts  (committed)
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PNG } from 'pngjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SOURCE = resolve(root, 'assets/signature/signature-source.png');
const OUT = resolve(root, 'src/app/shared/handwritten-signature/signature-strokes.ts');
const DEBUG = process.argv[2]; // optional: path of a debug PNG to write

let D = 1;
const neighbours = [[-1, -1], [0, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [0, 1], [1, 1]];
const SCALE = Number(process.env.SCALE ?? 1); // working resolution multiplier (1 = the source is already high resolution)
const OUT_WIDTH = 242; // the output coordinate space is normalised so the ink is this wide
const INK_THRESHOLD = Number(process.env.INK ?? 0.45); // absolute floor; keeps paper texture out
const HALF_MAX = Number(process.env.HALF ?? 0.5);
const CLOSE_RADIUS = Number(process.env.CLOSE ?? 2); // bridges hairline gaps left by the low-resolution source
const MIN_COMPONENT = Number(process.env.MINCOMP ?? 150); // working-pixels; drops specks
const SPUR = Number(process.env.SPUR ?? 14); // prune side-branches shorter than this (working px)
const JOIN_DISTANCE = Number(process.env.JOIN ?? 18); // working px
const JOIN_MAX_TURN = Number(process.env.TURN ?? 70); // degrees away from straight-on

// ---- 1. load + ink map -------------------------------------------------------------------------------
const png = PNG.sync.read(readFileSync(SOURCE));
const W0 = png.width;
const H0 = png.height;
const ink0 = new Float32Array(W0 * H0);
for (let i = 0; i < W0 * H0; i++) {
  const luminance = (png.data[i * 4] + png.data[i * 4 + 1] + png.data[i * 4 + 2]) / 3;
  ink0[i] = Math.max(0, 1 - luminance / 255) * (png.data[i * 4 + 3] / 255);
}

// ---- 2. upscale (bilinear) + blur + threshold --------------------------------------------------------
const W = W0 * SCALE;
const H = H0 * SCALE;
let ink = new Float32Array(W * H);
for (let y = 0; y < H; y++) {
  const sy = Math.min(H0 - 1, Math.max(0, (y + 0.5) / SCALE - 0.5));
  const y0 = Math.floor(sy);
  const y1 = Math.min(H0 - 1, y0 + 1);
  const fy = sy - y0;
  for (let x = 0; x < W; x++) {
    const sx = Math.min(W0 - 1, Math.max(0, (x + 0.5) / SCALE - 0.5));
    const x0 = Math.floor(sx);
    const x1 = Math.min(W0 - 1, x0 + 1);
    const fx = sx - x0;
    ink[y * W + x] = (ink0[y0 * W0 + x0] * (1 - fx) + ink0[y0 * W0 + x1] * fx) * (1 - fy)
      + (ink0[y1 * W0 + x0] * (1 - fx) + ink0[y1 * W0 + x1] * fx) * fy;
  }
}
ink = blur(ink, W, H, Number(process.env.BLUR ?? 1));
// Half-maximum threshold against the local peak, so bold and hairline strokes are both traced at their true width.
const localPeak = maxFilter(ink, W, H, Number(process.env.PEAK_R ?? 10));
let bin = new Uint8Array(W * H);
for (let i = 0; i < bin.length; i++) bin[i] = ink[i] > Math.max(INK_THRESHOLD, localPeak[i] * HALF_MAX) ? 1 : 0;
bin = closing(bin, W, H, CLOSE_RADIUS);
bin = removeSmallComponents(bin, W, H, MIN_COMPONENT);
bin = fillTinyHoles(bin, W, H);

const fillMask = bin.slice();
let inkBounds = { minX: W, minY: H, maxX: 0, maxY: 0 };
for (let i = 0; i < fillMask.length; i++) {
  if (!fillMask[i]) continue;
  const x = i % W;
  const y = (i - x) / W;
  inkBounds = { minX: Math.min(inkBounds.minX, x), minY: Math.min(inkBounds.minY, y), maxX: Math.max(inkBounds.maxX, x), maxY: Math.max(inkBounds.maxY, y) };
}
const inkWidth = inkBounds.maxX - inkBounds.minX;
const inkHeight = inkBounds.maxY - inkBounds.minY;
D = inkWidth / OUT_WIDTH; // working px per output unit
const distance = distanceTransform(fillMask, W, H);

// ---- 3. thin ---------------------------------------------------------------------------------------
thin(bin, W, H);

// ---- 4. skeleton -> strokes --------------------------------------------------------------------------
const at = (x, y) => (x >= 0 && y >= 0 && x < W && y < H ? bin[y * W + x] : 0);
const degree = (x, y) => neighbours.reduce((n, [dx, dy]) => n + at(x + dx, y + dy), 0);

let segments = traceSegments();
segments = prune(segments);
let strokes = join(segments);
strokes = strokes.filter((stroke) => polylineLength(stroke) > 4);

// ---- 5. classify, order, orient ----------------------------------------------------------------------
const boxOf = (points) => {
  const xs = points.map((p) => p[0]);
  const ys = points.map((p) => p[1]);
  return { minX: Math.min(...xs), maxX: Math.max(...xs), minY: Math.min(...ys), maxY: Math.max(...ys) };
};
// Underline: the long straight sweep. The skeleton breaks it into several pieces, so find the dominant straight line
// (RANSAC over the near-straight pieces) and take every stroke that lies along it. Everything above that line is the
// main signature, everything below it (the small circled mark) is 'marks'.
const straightness = (points) => {
  const first = points[0];
  const last = points[points.length - 1];
  return Math.hypot(last[0] - first[0], last[1] - first[1]) / Math.max(1, polylineLength(points));
};
const candidatePoints = strokes
  .filter((points) => polylineLength(points) > 0.05 * inkWidth && straightness(points) > 0.9)
  .flatMap((points) => points.filter((_, i) => i % 3 === 0));
let bestLine = null;
const sample = candidatePoints.filter((_, i) => i % Math.max(1, Math.floor(candidatePoints.length / 70)) === 0);
const tolerance = 0.018 * inkWidth;
for (let i = 0; i < sample.length; i++) {
  for (let j = i + 1; j < sample.length; j++) {
    const [x1, y1] = sample[i];
    const [x2, y2] = sample[j];
    if (Math.abs(x2 - x1) < 0.3 * inkWidth) continue; // the underline spans the signature, so use far-apart pairs
    const slope = (y2 - y1) / (x2 - x1);
    const inliers = candidatePoints.filter(([x, y]) => Math.abs(y - (y1 + slope * (x - x1))) < tolerance).length;
    if (!bestLine || inliers > bestLine.inliers) bestLine = { inliers, x1, y1, slope };
  }
}
const onLine = (x, y) => bestLine && Math.abs(y - (bestLine.y1 + bestLine.slope * (x - bestLine.x1))) < tolerance;
const underlineIds = new Set();
strokes.forEach((points, index) => {
  if (!bestLine || polylineLength(points) < 0.04 * inkWidth) return;
  const along = points.filter(([x, y]) => onLine(x, y)).length / points.length;
  if (along >= 0.7) underlineIds.add(index);
});
const lineAt = (x) => (bestLine ? bestLine.y1 + bestLine.slope * (x - bestLine.x1) : Infinity);
function classify(points, index) {
  if (underlineIds.has(index)) return 'underline';
  const cx = points.reduce((n, p) => n + p[0], 0) / points.length;
  const cy = points.reduce((n, p) => n + p[1], 0) / points.length;
  return cy > lineAt(cx) + 0.06 * inkHeight ? 'marks' : 'main';
}
const ORDER = ['main', 'underline', 'date', 'marks'];
const classified = strokes.map((points, index) => {
  const group = classify(points, index);
  // Write left-to-right; for the tall first stroke, top-to-bottom.
  const first = points[0];
  const last = points[points.length - 1];
  const dx = last[0] - first[0];
  const dy = last[1] - first[1];
  const vertical = Math.abs(dy) > Math.abs(dx) * 1.5;
  const flip = vertical ? dy < 0 : dx < 0;
  const oriented = flip ? [...points].reverse() : points;
  return { group, points: oriented };
});
classified.sort((a, b) => {
  const g = ORDER.indexOf(a.group) - ORDER.indexOf(b.group);
  if (g) return g;
  return minX(a.points) - minX(b.points);
});
// Date and marks are many small pieces: order them like a travelling pen (nearest next stroke, biased to move rightwards).
for (const group of ['date', 'marks']) {
  const members = classified.filter((c) => c.group === group);
  if (members.length < 3) continue;
  const remaining = [...members];
  const ordered = [remaining.splice(0, 1)[0]]; // left-most piece first
  while (remaining.length) {
    const pen = ordered[ordered.length - 1].points.at(-1);
    let best = null;
    remaining.forEach((candidate, index) => {
      for (const reverse of [false, true]) {
        const start = reverse ? candidate.points.at(-1) : candidate.points[0];
        const cost = Math.hypot(start[0] - pen[0], start[1] - pen[1]) + 0.6 * Math.max(0, pen[0] - start[0]);
        if (!best || cost < best.cost) best = { cost, index, reverse };
      }
    });
    const [picked] = remaining.splice(best.index, 1);
    ordered.push(best.reverse ? { ...picked, points: [...picked.points].reverse() } : picked);
  }
  const firstIndex = classified.findIndex((c) => c.group === group);
  classified.splice(firstIndex, members.length, ...ordered);
}

// ---- 6. smooth to Bézier path ------------------------------------------------------------------------
const result = classified.map((stroke, index) => {
  const simplified = smoothPoints(simplify(stroke.points, 1.6));
  const d = toBezier(simplified);
  // Mask stroke width: wide enough to cover the ink under this stroke (twice the thickest half-width, plus margin).
  let half = 0;
  for (const [x, y] of stroke.points) half = Math.max(half, distance[Math.min(H - 1, Math.max(0, y)) * W + Math.min(W - 1, Math.max(0, x))]);
  const width = Math.min(10, Math.max(2.4, (2 * half) / D + 2.4));
  return { id: `${stroke.group}-${index + 1}`, group: stroke.group, d, width: Math.round(width * 10) / 10, length: Math.round(polylineLength(simplified) / D * 10) / 10 };
});
const fillPath = traceFill(fillMask);
const viewBox = (() => {
  const pad = 3;
  const x = Math.floor(inkBounds.minX / D) - pad;
  const y = Math.floor(inkBounds.minY / D) - pad;
  return { x, y, width: Math.ceil(inkBounds.maxX / D) + pad - x, height: Math.ceil(inkBounds.maxY / D) + pad - y };
})();

const lines = [
  '// GENERATED by tools/trace-signature.mjs (npm run trace:signature) — do not edit by hand.',
  '// Single-line strokes traced from assets/signature/signature-source.png, in the source image\'s pixel space.',
  '',
  "export type SignatureGroup = 'main' | 'underline' | 'date' | 'marks';",
  'export type SignatureStroke = { readonly id: string; readonly group: SignatureGroup; readonly d: string; readonly length: number; readonly width: number };',
  '',
  '/** Tight crop around the ink, in the pixel space of the source image. */',
  `export const SIGNATURE_VIEWBOX = { x: ${viewBox.x}, y: ${viewBox.y}, width: ${viewBox.width}, height: ${viewBox.height} } as const;`,
  '',
  '/** The exact ink shape (fill-rule: evenodd), traced from the source bitmap. */',
  `export const SIGNATURE_FILL_PATH = '${fillPath}';`,
  '',
  '/** Pen strokes in writing order; used as an animated mask that reveals the fill. */',
  'export const SIGNATURE_STROKES: readonly SignatureStroke[] = ['
];
for (const stroke of result) lines.push(`  { id: '${stroke.id}', group: '${stroke.group}', length: ${stroke.length}, width: ${stroke.width}, d: '${stroke.d}' },`);
lines.push('];', '');
mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, lines.join('\n'), 'utf8');
console.log(`Wrote ${OUT}: ${result.length} strokes`, ORDER.map((g) => `${g}=${result.filter((s) => s.group === g).length}`).join(' '));
if (DEBUG) writeDebug(DEBUG);

// ============================================================================================================
function blur(source, width, height, radius) {
  const pass = (input, horizontal) => {
    const output = new Float32Array(input.length);
    const outer = horizontal ? height : width;
    const inner = horizontal ? width : height;
    for (let a = 0; a < outer; a++) {
      const get = (b) => input[horizontal ? a * width + b : b * width + a];
      let sum = 0;
      for (let b = -radius; b <= radius; b++) sum += get(Math.min(inner - 1, Math.max(0, b)));
      for (let b = 0; b < inner; b++) {
        output[horizontal ? a * width + b : b * width + a] = sum / (radius * 2 + 1);
        sum += get(Math.min(inner - 1, b + radius + 1)) - get(Math.max(0, b - radius));
      }
    }
    return output;
  };
  return pass(pass(source, true), false);
}

/** Morphological closing (dilate then erode) with a square structuring element. */
function closing(mask, width, height, radius) {
  const dilate = (input, grow) => {
    const horizontal = new Uint8Array(input.length);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let hit = grow ? 0 : 1;
        for (let d = -radius; d <= radius; d++) {
          const nx = x + d;
          const v = nx < 0 || nx >= width ? (grow ? 0 : 1) : input[y * width + nx];
          if (grow) { if (v) { hit = 1; break; } } else if (!v) { hit = 0; break; }
        }
        horizontal[y * width + x] = hit;
      }
    }
    const out = new Uint8Array(input.length);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let hit = grow ? 0 : 1;
        for (let d = -radius; d <= radius; d++) {
          const ny = y + d;
          const v = ny < 0 || ny >= height ? (grow ? 0 : 1) : horizontal[ny * width + x];
          if (grow) { if (v) { hit = 1; break; } } else if (!v) { hit = 0; break; }
        }
        out[y * width + x] = hit;
      }
    }
    return out;
  };
  return dilate(dilate(mask, true), false);
}

function maxFilter(source, width, height, radius) {
  const pass = (input, horizontal) => {
    const output = new Float32Array(input.length);
    const outer = horizontal ? height : width;
    const inner = horizontal ? width : height;
    for (let a = 0; a < outer; a++) {
      for (let b = 0; b < inner; b++) {
        let m = 0;
        for (let d = -radius; d <= radius; d++) {
          const c = b + d;
          if (c < 0 || c >= inner) continue;
          const v = input[horizontal ? a * width + c : c * width + a];
          if (v > m) m = v;
        }
        output[horizontal ? a * width + b : b * width + a] = m;
      }
    }
    return output;
  };
  return pass(pass(source, true), false);
}

/** Fills hairline slits and specks inside the ink (holes that are tiny or long and thin); real counters stay open. */
function fillTinyHoles(mask, width, height) {
  const out = Uint8Array.from(mask);
  const seen = new Uint8Array(mask.length);
  const stack = [];
  for (let start = 0; start < mask.length; start++) {
    if (mask[start] || seen[start]) continue;
    const members = [];
    let touchesBorder = false;
    let minX = width, maxX = 0, minY = height, maxY = 0;
    stack.push(start);
    seen[start] = 1;
    while (stack.length) {
      const i = stack.pop();
      members.push(i);
      const x = i % width;
      const y = (i - x) / width;
      if (x === 0 || y === 0 || x === width - 1 || y === height - 1) touchesBorder = true;
      minX = Math.min(minX, x); maxX = Math.max(maxX, x); minY = Math.min(minY, y); maxY = Math.max(maxY, y);
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = x + dx, ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
        const j = ny * width + nx;
        if (!mask[j] && !seen[j]) { seen[j] = 1; stack.push(j); }
      }
    }
    if (touchesBorder) continue;
    const w = maxX - minX + 1, h = maxY - minY + 1;
    const thin = Math.min(w, h) <= 8 && Math.max(w, h) / Math.min(w, h) > 5;
    if (members.length < 60 || thin) for (const i of members) out[i] = 1;
  }
  return out;
}

function percentile(values, p) {
  const sorted = Float32Array.from(values).sort();
  return sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * p))] || 1;
}

function removeSmallComponents(mask, width, height, minSize) {
  const seen = new Uint8Array(mask.length);
  const out = new Uint8Array(mask.length);
  const stack = [];
  for (let start = 0; start < mask.length; start++) {
    if (!mask[start] || seen[start]) continue;
    const members = [];
    stack.push(start);
    seen[start] = 1;
    while (stack.length) {
      const i = stack.pop();
      members.push(i);
      const x = i % width;
      const y = (i - x) / width;
      for (const [dx, dy] of neighbours) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
        const j = ny * width + nx;
        if (mask[j] && !seen[j]) { seen[j] = 1; stack.push(j); }
      }
    }
    if (members.length >= minSize) for (const i of members) out[i] = 1;
  }
  return out;
}

/** Zhang–Suen thinning, in place. */
function thin(mask, width, height) {
  const toClear = [];
  let changed = true;
  while (changed) {
    changed = false;
    for (let pass = 0; pass < 2; pass++) {
      toClear.length = 0;
      for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
          const i = y * width + x;
          if (!mask[i]) continue;
          const p2 = mask[i - width], p3 = mask[i - width + 1], p4 = mask[i + 1], p5 = mask[i + width + 1];
          const p6 = mask[i + width], p7 = mask[i + width - 1], p8 = mask[i - 1], p9 = mask[i - width - 1];
          const b = p2 + p3 + p4 + p5 + p6 + p7 + p8 + p9;
          if (b < 2 || b > 6) continue;
          const a = (!p2 && p3) + (!p3 && p4) + (!p4 && p5) + (!p5 && p6) + (!p6 && p7) + (!p7 && p8) + (!p8 && p9) + (!p9 && p2);
          if (a !== 1) continue;
          if (pass === 0 ? (p2 * p4 * p6 === 0 && p4 * p6 * p8 === 0) : (p2 * p4 * p8 === 0 && p2 * p6 * p8 === 0)) toClear.push(i);
        }
      }
      for (const i of toClear) mask[i] = 0;
      if (toClear.length) changed = true;
    }
  }
}

function traceSegments() {
  const visited = new Uint8Array(W * H);
  const isNode = (x, y) => degree(x, y) !== 2;
  const out = [];
  const walk = (sx, sy, firstX, firstY) => {
    const points = [[sx, sy]];
    let px = sx, py = sy, cx = firstX, cy = firstY;
    for (;;) {
      points.push([cx, cy]);
      if (isNode(cx, cy)) break;
      visited[cy * W + cx] = 1;
      let moved = false;
      // Prefer 4-connected steps so staircase corners do not create spurious diagonals.
      const order = [[0, -1], [1, 0], [0, 1], [-1, 0], [-1, -1], [1, -1], [-1, 1], [1, 1]];
      for (const [dx, dy] of order) {
        const nx = cx + dx, ny = cy + dy;
        if ((nx === px && ny === py) || !at(nx, ny)) continue;
        if (visited[ny * W + nx] && !isNode(nx, ny)) continue;
        px = cx; py = cy; cx = nx; cy = ny; moved = true;
        break;
      }
      if (!moved) break;
    }
    return points;
  };
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (!at(x, y) || !isNode(x, y)) continue;
      for (const [dx, dy] of neighbours) {
        const nx = x + dx, ny = y + dy;
        if (!at(nx, ny)) continue;
        if (!isNode(nx, ny) && visited[ny * W + nx]) continue;
        if (isNode(nx, ny) && (nx < x || (nx === x && ny < y))) continue; // node-node edges once
        const pts = walk(x, y, nx, ny);
        if (pts.length > 1) out.push(pts);
      }
    }
  }
  // Closed loops without any node.
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (!at(x, y) || visited[y * W + x] || isNode(x, y)) continue;
      const first = neighbours.map(([dx, dy]) => [x + dx, y + dy]).find(([nx, ny]) => at(nx, ny));
      if (!first) continue;
      const pts = walk(x, y, first[0], first[1]);
      if (pts.length > 4) out.push(pts);
    }
  }
  return out;
}

function polylineLength(points) {
  let total = 0;
  for (let i = 1; i < points.length; i++) total += Math.hypot(points[i][0] - points[i - 1][0], points[i][1] - points[i - 1][1]);
  return total;
}

function minX(points) {
  return Math.min(...points.map((p) => p[0]));
}

/** Remove short dangling spurs left by thinning. */
function prune(list) {
  const endpointCount = new Map();
  const key = (p) => `${p[0]},${p[1]}`;
  for (const s of list) {
    endpointCount.set(key(s[0]), (endpointCount.get(key(s[0])) ?? 0) + 1);
    endpointCount.set(key(s[s.length - 1]), (endpointCount.get(key(s[s.length - 1])) ?? 0) + 1);
  }
  return list.filter((s) => {
    if (polylineLength(s) >= SPUR) return true;
    const a = endpointCount.get(key(s[0])) ?? 0;
    const b = endpointCount.get(key(s[s.length - 1])) ?? 0;
    return !(a === 1 || b === 1); // short and dangling -> spur
  });
}

/** Join strokes through junctions where the pen would continue (smallest turn angle first). */
function join(list) {
  const items = list.map((points) => ({ points: [...points], alive: true }));
  const dir = (points, atEnd) => {
    const n = Math.min(10, points.length - 1);
    const a = atEnd ? points[points.length - 1 - n] : points[n];
    const b = atEnd ? points[points.length - 1] : points[0];
    const dx = b[0] - a[0], dy = b[1] - a[1];
    const l = Math.hypot(dx, dy) || 1;
    return [dx / l, dy / l]; // direction travelling out of the end
  };
  for (;;) {
    let best = null;
    for (let i = 0; i < items.length; i++) {
      if (!items[i].alive) continue;
      for (let j = i; j < items.length; j++) {
        if (!items[j].alive) continue;
        for (const ei of [false, true]) {
          for (const ej of [false, true]) {
            if (i === j && ei === ej) continue;
            const a = items[i].points, b = items[j].points;
            const pa = ei ? a[a.length - 1] : a[0];
            const pb = ej ? b[b.length - 1] : b[0];
            const distance = Math.hypot(pa[0] - pb[0], pa[1] - pb[1]);
            if (distance > JOIN_DISTANCE) continue;
            const da = dir(a, ei), db = dir(b, ej);
            // Leaving end A and entering end B should be anti-parallel directions-out of each end.
            const cos = -(da[0] * db[0] + da[1] * db[1]);
            const turn = Math.acos(Math.max(-1, Math.min(1, cos))) * 180 / Math.PI;
            if (turn > JOIN_MAX_TURN) continue;
            const score = turn + distance * 2;
            if (!best || score < best.score) best = { score, i, j, ei, ej };
          }
        }
      }
    }
    if (!best) break;
    const { i, j, ei, ej } = best;
    if (i === j) { items[i].points.push(items[i].points[0]); items[i].alive = true; break; }
    let a = items[i].points, b = items[j].points;
    if (!ei) a = [...a].reverse(); // make A's joining end the last
    if (ej) b = [...b].reverse(); // make B's joining end the first
    items[i].points = [...a, ...b];
    items[j].alive = false;
  }
  return items.filter((it) => it.alive).map((it) => it.points);
}

function simplify(points, tolerance) {
  if (points.length < 3) return points;
  const keep = new Uint8Array(points.length);
  keep[0] = keep[points.length - 1] = 1;
  const stack = [[0, points.length - 1]];
  while (stack.length) {
    const [s, e] = stack.pop();
    let maxD = 0, index = -1;
    const [x1, y1] = points[s], [x2, y2] = points[e];
    const len = Math.hypot(x2 - x1, y2 - y1) || 1;
    for (let i = s + 1; i < e; i++) {
      const d = Math.abs((y2 - y1) * points[i][0] - (x2 - x1) * points[i][1] + x2 * y1 - y2 * x1) / len;
      if (d > maxD) { maxD = d; index = i; }
    }
    if (maxD > tolerance && index > 0) { keep[index] = 1; stack.push([s, index], [index, e]); }
  }
  return points.filter((_, i) => keep[i]);
}

/** Light Chaikin-style smoothing of a simplified polyline (keeps the end points). */
function smoothPoints(points) {
  let current = points;
  for (let n = 0; n < 2; n++) {
    if (current.length < 3) break;
    const next = [current[0]];
    for (let i = 0; i < current.length - 1; i++) {
      const p = current[i], q = current[i + 1];
      next.push([p[0] * 0.75 + q[0] * 0.25, p[1] * 0.75 + q[1] * 0.25], [p[0] * 0.25 + q[0] * 0.75, p[1] * 0.25 + q[1] * 0.75]);
    }
    next.push(current[current.length - 1]);
    current = next;
  }
  return current;
}

/** Catmull-Rom -> cubic Bézier, coordinates in the normalised units (the ink is 242 wide). */
function toBezier(points) {
  const n = (v) => Math.round((v / D) * 100) / 100;
  const P = (p) => `${n(p[0] + 0.5)} ${n(p[1] + 0.5)}`;
  if (points.length === 1) return `M${P(points[0])}`;
  let d = `M${P(points[0])}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)], p1 = points[i], p2 = points[i + 1], p3 = points[Math.min(points.length - 1, i + 2)];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${P(c1)} ${P(c2)} ${P(p2)}`;
  }
  return d;
}

/** Chamfer distance to the nearest background pixel (working px). */
function distanceTransform(mask, width, height) {
  const d = new Float32Array(mask.length);
  for (let i = 0; i < d.length; i++) d[i] = mask[i] ? 1e6 : 0;
  const a = 1;
  const b = Math.SQRT2;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = y * width + x;
      if (!d[i]) continue;
      let v = d[i];
      if (x > 0) v = Math.min(v, d[i - 1] + a);
      if (y > 0) {
        v = Math.min(v, d[i - width] + a);
        if (x > 0) v = Math.min(v, d[i - width - 1] + b);
        if (x < width - 1) v = Math.min(v, d[i - width + 1] + b);
      }
      d[i] = v;
    }
  }
  for (let y = height - 1; y >= 0; y--) {
    for (let x = width - 1; x >= 0; x--) {
      const i = y * width + x;
      if (!d[i]) continue;
      let v = d[i];
      if (x < width - 1) v = Math.min(v, d[i + 1] + a);
      if (y < height - 1) {
        v = Math.min(v, d[i + width] + a);
        if (x < width - 1) v = Math.min(v, d[i + width + 1] + b);
        if (x > 0) v = Math.min(v, d[i + width - 1] + b);
      }
      d[i] = v;
    }
  }
  return d;
}

/** Outline of the ink mask as one even-odd SVG path in source-pixel coordinates (crack following + smoothing). */
function traceFill(mask) {
  const px = (x, y) => (x >= 0 && y >= 0 && x < W && y < H ? mask[y * W + x] : 0);
  // Directed boundary edges between lattice points, ink on the left-hand side.
  const next = new Map();
  const add = (x1, y1, x2, y2) => {
    const key = `${x1},${y1}`;
    const list = next.get(key);
    if (list) list.push([x2, y2]);
    else next.set(key, [[x2, y2]]);
  };
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (!px(x, y)) continue;
      if (!px(x, y - 1)) add(x, y, x + 1, y); // top edge, heading right
      if (!px(x + 1, y)) add(x + 1, y, x + 1, y + 1); // right edge, heading down
      if (!px(x, y + 1)) add(x + 1, y + 1, x, y + 1); // bottom edge, heading left
      if (!px(x - 1, y)) add(x, y + 1, x, y); // left edge, heading up
    }
  }
  const loops = [];
  for (const [startKey, list] of next) {
    while (list.length) {
      const [sx, sy] = startKey.split(',').map(Number);
      const loop = [[sx, sy]];
      let [cx, cy] = list.pop();
      let guard = 0;
      while (!(cx === sx && cy === sy) && guard++ < 2000000) {
        loop.push([cx, cy]);
        const options = next.get(`${cx},${cy}`);
        if (!options || !options.length) break;
        const prev = loop[loop.length - 2];
        const heading = [cx - prev[0], cy - prev[1]];
        options.sort((p, q) => turnOrder(heading, [p[0] - cx, p[1] - cy]) - turnOrder(heading, [q[0] - cx, q[1] - cy]));
        [cx, cy] = options.shift();
      }
      if (loop.length > 8) loops.push(loop);
    }
  }
  const n = (v) => Math.round((v / D) * 20) / 20;
  return loops.map((loop) => {
    let pts = simplify(loop, 1.1);
    pts = chaikin(pts, 2);
    pts = simplify(pts, 0.35);
    return `M${pts.map((p) => `${n(p[0])} ${n(p[1])}`).join('L')}Z`;
  }).join('');
}

function turnOrder(heading, step) {
  const cross = heading[0] * step[1] - heading[1] * step[0];
  return cross < 0 ? 0 : cross === 0 ? 1 : 2;
}

function chaikin(points, rounds) {
  let current = points;
  for (let r = 0; r < rounds; r++) {
    if (current.length < 4) break;
    const out = [];
    for (let i = 0; i < current.length; i++) {
      const p = current[i];
      const q = current[(i + 1) % current.length];
      out.push([p[0] * 0.75 + q[0] * 0.25, p[1] * 0.75 + q[1] * 0.25], [p[0] * 0.25 + q[0] * 0.75, p[1] * 0.25 + q[1] * 0.75]);
    }
    current = out;
  }
  return current;
}

function writeDebug(path) {
  const out = new PNG({ width: W, height: H });
  for (let i = 0; i < W * H; i++) {
    const v = 255 - Math.round(ink[i] * 90);
    out.data[i * 4] = out.data[i * 4 + 1] = out.data[i * 4 + 2] = v;
    out.data[i * 4 + 3] = 255;
    if (bin[i]) { out.data[i * 4] = 220; out.data[i * 4 + 1] = 40; out.data[i * 4 + 2] = 40; }
  }
  writeFileSync(path, PNG.sync.write(out));
}
