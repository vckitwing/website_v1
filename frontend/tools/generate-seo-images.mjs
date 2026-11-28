// Makes the browser-tab icons and the picture shown when a link to the site is shared, from the party's logo and the
// supplied portrait (placed as they are, never altered). Run `npm run generate:seo-images` after changing either.
import { mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'public', 'seo');
mkdirSync(out, { recursive: true });
const logo = path.join(root, 'public', 'assets', 'Logo', 'vck_logo.jpg');
const portrait = path.join(root, 'assets-src', 'hero_section', 'thiruma.png');

/** The whole logo on a round white disc, on a transparent square: shrunk a little so none of its lettering is cut. */
async function roundLogo(size) {
  const inner = Math.round(size * 0.9);
  const fitted = await sharp(logo).resize(inner, inner, { fit: 'contain', background: '#fefefe' }).png().toBuffer();
  const disc = Buffer.from(`<svg width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="#fefefe"/></svg>`);
  // first lay the logo on a white square, then cut the square to a circle
  const square = await sharp({ create: { width: size, height: size, channels: 4, background: '#fefefe' } })
    .composite([{ input: fitted, gravity: 'centre' }])
    .png()
    .toBuffer();
  return sharp(square).composite([{ input: disc, blend: 'dest-in' }]).png().toBuffer();
}

for (const [name, size] of [['favicon-32.png', 32], ['apple-touch-icon.png', 180], ['icon-192.png', 192], ['icon-512.png', 512]]) {
  await sharp(await roundLogo(size)).toFile(path.join(out, name));
}

const background = Buffer.from(`<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#15569a"/><stop offset="0.55" stop-color="#07111f"/><stop offset="1" stop-color="#b71e36"/></linearGradient></defs>
  <rect width="1200" height="630" fill="url(#g)"/>
</svg>`);
const person = await sharp(portrait).resize({ height: 600, width: 620, fit: 'inside' }).png().toBuffer();
const { width, height } = await sharp(person).metadata();
await sharp(background)
  .composite([
    { input: await roundLogo(360), left: 130, top: 135 },
    { input: person, left: 1200 - width - 40, top: 630 - height }
  ])
  .jpeg({ quality: 86 })
  .toFile(path.join(out, 'share.jpg'));

console.log('Icons and share image written to public/seo/');
