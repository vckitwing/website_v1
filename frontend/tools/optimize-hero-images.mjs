// Converts the hero source images (assets-src/hero_section/*.png, not served) into the WebP files the site loads
// (assets/hero_section/*.webp). The originals are 1.7-1.9 MB PNGs; the WebP versions are a fraction of that, which matters
// on phones. Run after replacing a source image:  npm run optimize:images   (needs the `sharp` devDependency)
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const SRC = 'assets-src/hero_section';
const OUT = 'assets/hero_section';
// Per-image settings: the portrait keeps its transparency crisp; the crowd is blended and masked, so it can be lighter.
const SETTINGS = {
  thiruma: { quality: 84, alphaQuality: 92 },
  crowd: { quality: 74 }
};

fs.mkdirSync(OUT, { recursive: true });
for (const file of fs.readdirSync(SRC).filter((name) => name.endsWith('.png'))) {
  const name = path.parse(file).name;
  const target = path.join(OUT, `${name}.webp`);
  await sharp(path.join(SRC, file)).webp({ effort: 6, ...(SETTINGS[name] ?? { quality: 80 }) }).toFile(target);
  const before = fs.statSync(path.join(SRC, file)).size;
  const after = fs.statSync(target).size;
  console.log(`${file}: ${(before / 1024).toFixed(0)} kB -> ${name}.webp ${(after / 1024).toFixed(0)} kB`);
}
