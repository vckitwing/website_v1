// Runs after the build: writes robots.txt and sitemap.xml, and the 404.html that static hosts serve for unknown
// addresses. The site address and the list of pages come from src/app/seo/site.config.json.
import { copyFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'dist', 'vck-website', 'browser');
const config = JSON.parse(readFileSync(path.join(root, 'src', 'app', 'seo', 'site.config.json'), 'utf8'));
const donationIsSample = /isSample:\s*true/.test(readFileSync(path.join(root, 'src', 'app', 'pages', 'donate', 'data', 'donate.data.ts'), 'utf8'));
const site = config.siteUrl.replace(/\/$/, '');

const address = (language, page) => `${site}/${[language === 'ta' ? '' : language, page].filter(Boolean).join('/')}`.replace(/\/?$/, '/');
const listed = config.pages.filter((page) => !(page === 'donate' && donationIsSample));

const urls = listed.flatMap((page) =>
  ['ta', 'en'].map(
    (language) => `  <url>
    <loc>${address(language, page)}</loc>
    <xhtml:link rel="alternate" hreflang="ta" href="${address('ta', page)}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${address('en', page)}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${address('ta', page)}"/>
  </url>`
  )
);
writeFileSync(
  path.join(out, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}\n</urlset>\n`
);

// While indexing is off, crawlers are still allowed in so that they see each page's "noindex".
writeFileSync(path.join(out, 'robots.txt'), `User-agent: *\nAllow: /\n${config.allowIndexing ? `\nSitemap: ${site}/sitemap.xml\n` : ''}`);

const shell = path.join(out, 'index.csr.html');
copyFileSync(existsSync(shell) ? shell : path.join(out, 'index.html'), path.join(out, '404.html'));

console.log(`SEO files written: ${urls.length} addresses in the sitemap; indexing ${config.allowIndexing ? 'ON' : 'OFF'}.`);
