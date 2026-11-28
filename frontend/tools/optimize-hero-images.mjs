// Converts the source images (assets-src/..., not served) into the WebP files the site loads (assets/...). The originals are
// 1.7-2.2 MB PNGs / large JPEGs; the WebP versions are a fraction of that, which matters on phones.
// Run after replacing a source image:  npm run optimize:images   (needs the `sharp` devDependency)
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const JOBS = [
  {
    // Hero: the portrait keeps its transparency crisp; the crowd is blended and masked, so it can be lighter.
    src: 'assets-src/hero_section',
    out: 'assets/hero_section',
    settings: { thiruma: { quality: 84, alphaQuality: 92 }, crowd: { quality: 74 } }
  },
  {
    // The thinkers' portraits (shown in a tall frame at up to ~800 px high, so 1600 px covers retina screens).
    src: 'assets-src/Ideology_leaders',
    out: 'assets/Ideology_leaders',
    maxHeight: 1600,
    settings: { ambedkar: { quality: 82 }, periyar: { quality: 82 }, marx: { quality: 82 } }
  }
];

for (const job of JOBS) {
  fs.mkdirSync(job.out, { recursive: true });
  for (const file of fs.readdirSync(job.src).filter((name) => /\.(png|jpe?g)$/i.test(name))) {
    const name = path.parse(file).name;
    const target = path.join(job.out, `${name}.webp`);
    let image = sharp(path.join(job.src, file));
    if (job.maxHeight) image = image.resize({ height: job.maxHeight, withoutEnlargement: true });
    await image.webp({ effort: 6, ...(job.settings[name] ?? { quality: 80 }) }).toFile(target);
    const before = fs.statSync(path.join(job.src, file)).size;
    const after = fs.statSync(target).size;
    console.log(`${job.src}/${file}: ${(before / 1024).toFixed(0)} kB -> ${target} ${(after / 1024).toFixed(0)} kB`);
  }
}
