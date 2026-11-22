# CLAUDE.md

Guidance for Claude Code when working in this repository. **Keep this file current** — see "Maintaining this file" at the bottom.

## Project

Official website for **Viduthalai Chiruthaigal Katchi (VCK)**, a Tamil Nadu political party. A single-page, scroll-driven, animation-heavy, **bilingual (English / Tamil)** site with dark/light themes. Currently only the landing page is in scope; see "Site map (planned)" for the full planned structure and "Backend (planned)" for the Python API.

## Tech stack

- Angular 22 (standalone components, signals, `OnPush`, no NgModules, no router yet) — `@angular/build:application` builder
- TypeScript 6, `strict` + `strictTemplates`
- GSAP 3 (+ `ScrollTrigger`, dynamically imported) for all animation
- three.js 0.180 (3D headline, relief portrait and the opening-screen effects; all lazy-loaded). Plain three.js is used rather than Angular Three, to match the existing `HeroStarNetwork` pattern and avoid a new dependency.
- **SCSS only** — component-scoped `.scss` files, global styles in `frontend/src/styles.scss`
- Node 26 in CI
- Dev-only: `fontkit` + `@fontsource/*` fonts for the headline outline generator (not shipped)

## Commands

Run from `frontend/`:

```bash
npm ci            # install
npm start         # ng serve (development config) -> http://localhost:4200
npm run build     # production build -> frontend/dist/vck-website/browser
```

No test runner, linter or formatter is configured. Verify changes with `npm run build` (type-checks templates strictly; bundle budgets: warn 600kB / error 1MB initial) and by viewing in the browser.

## Architecture

Monorepo:

```
frontend/        Angular app (all npm commands run here)
backend/         Python API — planned, README placeholder only
docs/            Project docs (empty for now)
.github/         CI/CD (deploys frontend)
CLAUDE.md
```

Frontend entry: `frontend/src/main.ts` bootstraps `AppComponent` (`vck-root`).

`AppComponent` owns the page shell: opening intro, top bar (brand, language toggle, theme toggle, mobile menu), mega-nav, the hero section, the four content sections, footer, and a shared fixed "star journey" overlay. Global state lives here as signals and is passed down to sections via `@Input() language`. (Hero/header/nav still live in `AppComponent`; extract them into `pages/home/` / a layout component when touching them substantially.)

```
frontend/src/
  main.ts, index.html, styles.scss     Bootstrap, host page, global SCSS
  app/
    app.component.{ts,html,scss}       Shell, slogans, nav data, theme/language state
    pages/home/                        The landing page (only page for now)
      hero/                            hero-portrait-reveal,
                                       hero-star-handoff, opening-animation, hero-typography.scss
        portrait/                      hero-portrait-3d.ts: depth-relief ("3D") view of the leader's photo
        typography/                    3D headline: hero-typography-3d.ts (three.js class) and
                                       hero-headline-outlines.ts (GENERATED glyph outlines)
      sections/<name>/                 flag, ideology, history, thinkers
        <name>-section.component.{ts,html,scss}
        <name>-animation.ts            GSAP/ScrollTrigger timeline factory for that section
        data/                          Typed content + types (en/ta)
    pages/<future>/                    One folder per future page from the site map
    shared/                            Cross-page code (import via `@shared/...` alias)
      story/                           star-journey.ts, flag-star-geometry.ts
      handwritten-signature/           Self-writing signature component + GENERATED signature-strokes.ts
      theme-switch-transition/         Theme change overlay component
frontend/tools/    Dev-time Node scripts (generate-typography-outlines.mjs, trace-signature.mjs)
frontend/assets/   Source images (Ideology_leaders, Logo, hero_section, portraits, book_assets, vendor)
frontend/public/   Served at site root (portraits/, assets/Logo/)
```

### Conventions

- **Bilingual everywhere.** Every user-visible string needs `en` and `ta` variants. Content lives in `data/` files (`{ en, ta }` objects, or separate `*.en.ts` / `*.ta.ts` as in ideology). Template strings in `app.component.ts` use `language() === 'ta' ? … : …`. Never ship an English-only string. Tamil text uses `Noto Sans Tamil` / `Anek Tamil`; test line wrapping.
- **3D hero headline** ("ORGANIZE AND UNITE" / "அமைப்பாய்த் திரள்வோம்"). Real extruded three.js geometry (`HeroTypography3D`), lazy-loaded from `AppComponent.ngOnInit`, in a `<canvas class="hero-headline-3d">` behind the portrait. API: constructor takes the headline canvas and the ribbon-front canvas; `reveal()` (after the opening animation), `setLanguage()`, `setTheme()`, `destroy()`. It handles pointer parallax, float, reduced-motion (static frame), pausing off-screen, and compact/mobile quality. Tamil needs complex-script shaping that `TextGeometry` can't do, so glyph outlines are pre-shaped at dev time with `fontkit` into `hero-headline-outlines.ts` — **never edit that file by hand**; to change the text or fonts edit `tools/generate-typography-outlines.mjs` and run `npm run generate:headline` (fonts come from the `@fontsource/anek-tamil` and `@fontsource/outfit` devDependencies, OFL: Anek Tamil ExtraBold for Tamil, Outfit Black for English). The frontend is Node/Angular only — no Python. Layout/lighting constants live in `HERO_TYPOGRAPHY_CONFIG`. The canvas is full-bleed (extends past the hero's side padding, explicit `width: calc(...)` because a canvas won't stretch from left/right alone). The hero fills the first screen (`.hero { min-height: calc(100svh - 92px) }`), so the next section starts below the fold. Desktop: the copy block sits at the bottom-left under the headline. Mobile: see "Mobile hero layout".
- **3D portrait.** `HeroPortrait3D` (lazy, three.js) renders the *supplied* `thiruma.png` as a shallow depth relief with pointer parallax and brand-coloured rim light. The relief is derived from the photo's own alpha cut-out (rounded per-scanline profile) — no AI-generated face or head model, so the likeness is never altered; keep `HERO_PORTRAIT_3D_CONFIG.depth/parallax` subtle. It sits in `<canvas class="hero-portrait-3d">` over the flat `<img>` (same box and mask), fades in after the portrait reveal finishes, then the `<img>` is hidden via `.portrait-3d-active`. Skipped for reduced motion; the flat photo is the fallback if WebGL fails.
- **Portrait is mirrored.** The flat `<img>` and the relief canvas are flipped with CSS `transform: scaleX(-1)` (rules in `app.component.scss`, desktop and mobile variants). Mirroring the element also mirrors its mask, so those two use `$portrait-mask-mirrored` (fade runs `to left`), the img uses `object-position: left center`, mobile uses `translateX(-50%) scaleX(-1)`, and the 3D plane is left-aligned with negated parallax. The contour-trace canvas is **not** mirrored via CSS (GSAP animates its `transform`/`scale` and would drop the flip); `hero-portrait-reveal.ts` draws the contours mirrored instead. Don't use the CSS `scale` property on GSAP-animated elements — GSAP resets it to `none`. To un-flip, reverse all of these together.
- **No hero background decoration.** The hero background wave lines and the connected-dot star network were removed on purpose; don't re-add them. The hero-to-flag star journey (`hero-star-handoff.ts`, shared overlay) is separate and stays.
- **Handwritten signature.** `<vck-handwritten-signature>` (shared) writes the supplied signature with `trigger="viewport"` (IntersectionObserver) or `trigger="manual"` + `play()`. It plays once and stays visible; reduced motion shows it complete. The visible ink is the traced outline of the real signature (`SIGNATURE_FILL_PATH`, transparent background — nothing is redrawn), revealed through an SVG `<mask>` of pen strokes animated with `stroke-dasharray`/`stroke-dashoffset` (GSAP timeline) in writing order: main signature, underline, then the circled mark below it. Data comes from `tools/trace-signature.mjs` (`npm run trace:signature`, source `assets/signature/signature-source.png` — the high-resolution scan on a light-blue textured paper background; `pngjs` devDependency) — never edit `signature-strokes.ts` by hand. The script is generic: ink = dark pixels above a floor (so paper texture is ignored), output coordinates are normalised so the ink is 242 units wide, the underline is found as the dominant straight line (RANSAC) and strokes below it become the circled mark. Tuning knobs are env vars at the top of the script (`INK`, `CLOSE`, `SPUR`, `JOIN`, …). To change the signature, replace the source image and re-run, then check the preview. Pen speeds/pauses are constants at the top of the component; ink colour follows the theme and can be overridden with `--signature-ink`. In the hero it lives in `.hero-signature` (`pages/home/hero/hero-signature.scss`): bottom-right over the crowd on desktop, in the normal flow under the portrait on mobile (see "Mobile hero layout"). `AppComponent` calls `play()` ~0.9 s after the opening animation finishes. The hero instance uses `[replay]="true"`: after the first signing, scrolling away wipes it and scrolling back up to the hero signs it again (IntersectionObserver re-arm in `watchForReentry()`). This project is Angular, not AngularJS.
- **Opening sequence** (`opening-animation.ts`, DOM in `app.component.html` `.opening-screen`). (1) The star comes up alone at the page centre, then moves right while VCK arrives on its left — the pair is centred (DOM order is copy, then star). (2) VCK shrinks and rises to share the star's height, with the full name beneath it, both right-aligned; the group is centred. (3) The star flies to the portrait while VCK and the name turn left-aligned and land exactly on the header's own VCK / name: the script measures the header at play time and matches position, size, letter-spacing, weight and colour (so don't change the header brand CSS without checking the merge; on mobile the header wraps the name, and the flying copy wraps to match). The text column's width is frozen (`gsap.set(vck.parentElement, { width })`) so letter-spacing tweens can't re-centre the flex row. The header text is revealed under the overlay via the temporary `opening-brand-ready` class before the overlay fades.
- **No pure white.** Design rule: never use `#fff` / `#ffffff` / `rgb(255,255,255)` / the `white` keyword for text, fills, strokes or glows. The site's white is **`#f4f7fc`** (`rgba(244, 247, 252, a)` for translucent tints; 3D uses `0xf4f7fc`). The only intentional pure-white values left: the signature's SVG mask stroke (functional, never visible) and the logo disc background behind the logo image. Check with `grep -rniE "#fff|255, ?255, ?255" frontend/src` before finishing UI work.
- **Mobile hero layout (<= 760px, `hero-mobile.scss`, loaded last).** One column, top to bottom: (1) the 3D headline as its own in-flow canvas block (`$headline-height`), with the text *fitted inside* the screen (longest line = `coverage.mobile` of the canvas width, `mobileLayout` media query in `hero-typography-3d.ts`) so it is never cut at the edges — desktop is the opposite (monumental, bleeding off-screen); (2) the portrait (spacer `.portrait-stage`; the absolutely-placed portrait layers start at `$headline-height - 48px`); (3) the signature, in flow, tucked up into the portrait's faded base; (4) the running slogan + eyebrow, overlaid on the crowd (`.crowd-strip` is taller on mobile so it sits behind the lower stack). If you change `$headline-height` or the portrait aspect, update the `top` / spacer maths together.
- **3D headline look (reference-style editorial hero).** English text is **title case** ("Organize / And Unite", Outfit SemiBold 600; `WEIGHT` env var in the generator script picks the weight) in **graphite chrome** (neutral grey metal, `PALETTES` in `hero-typography-3d.ts`; the earlier flowing white/blue/red text gradient was dropped on purpose). Strong perspective tilt (`baseRotation`) and a big desktop bleed. The finish is satin (face roughness .34 / clear-coat .8, sides .46); letters are opaque; the shadow is very blurry (`VSMShadowMap`, `HERO_TYPOGRAPHY_CONFIG.shadowBlur`).
- **Red/blue ribbons** (`typography/hero-ribbons.ts`, `HeroRibbons`). Two glossy ribbons (one red-led, one blue-led, colours flowing along them) animate continuously and weave through the 3D letters **and** the portrait. One set of animated geometry is shared by two renderers separated by a world-space clip plane just in front of the letters: the **back** layer (the headline canvas, with the letters, behind the portrait) draws the ribbon parts behind the plane; the **front** layer (`<canvas class="hero-ribbon-front">`, z-index above the portrait) draws the parts in front of it. The right-hand part of the path is pushed down so ribbons never cross the face. Ribbon vertex colours are deliberately dark (×0.42) because the scene's strong red/blue point lights would otherwise wash them out to pink. Tunables: `HERO_RIBBON_CONFIG`. It needs a 3rd WebGL context; on mobile the front canvas covers only the headline block.
- **Hero experiments tried and reverted by the user (don't re-apply unless asked).** Deep-crimson 3D headline in the dark theme; removing the hero pill; stronger headline perspective (`baseRotation` y -0.4) and a bigger left shift; glassy-gel ribbons (translucent, rounded cross-section), snake-like tube ribbons, and satin ribbons spiralling around the text; and a low-poly panther/cheetah backdrop in the hero's upper left (several drafts, removed on request — the 'No hero background decoration' rule stands). The committed look (graphite headline, red/blue flat ribbons, pill) is the baseline. The red/blue balls on the opening star's tips were removed (user request) and stay removed.
- **Editorial left column + index.** Small label (`EST. 1982 · VIDUTHALAI CHIRUTHAIGAL KATCHI` / Tamil) replaces the old eyebrow; the slogan mixes a light base weight (500) with a bold red highlight word; below it is a decorative pill (`.hero-pill`, a non-interactive `<span>` on purpose — "no action"; hidden on mobile). On the right edge a vertical **01–04 slide index** (`.slide-index`, a row under the slogan on mobile) lists four slogans (`sloganDeck` = slogans 0, 1, 4, 6): it auto-advances every 5.2 s and each number is a button (`selectSlide()`, which also restarts the timer). The old "PEOPLE · JUSTICE · LIBERATION" vertical note was removed.
- **Typography: Outfit.** Both the rotating slogan and the 3D headline use **Outfit** (geometric sans, SIL OFL — free for commercial use). Slogan: Outfit 700 in sentence case (the highlighted word is 800 and solid red), loaded from the Google Fonts `@import` in `styles.scss`; Plus Jakarta Sans is the fallback. 3D headline: Outfit SemiBold (600) outlines, title case, generated by `tools/generate-typography-outlines.mjs` from `@fontsource/outfit`. Outfit is Latin-only, so Tamil uses Noto Sans Tamil 700 for the slogan (`text-transform: none`) and Anek Tamil ExtraBold for the 3D headline. Earlier experiments with Rushford Printed (personal-use-only licence — must NOT be used/committed without a licence from its author) and Londrina Solid were dropped. The slogan is split into word boxes (`.hero-word`, built by `toWords()` in `AppComponent`) and revealed word by word — each word rises from under its line, which clips its overflow; the gap between words is a margin, not a space character. On mobile all slogan sizes are reduced so lines wrap inside the screen (checked for every slogan).
- **Hero copy legibility.** The rotating slogan sits over a photo, so it has a dark scrim (`.hero-copy::before`), a text-shadow, and a **solid** highlight colour (`.hero-highlight`) — no gradient/colour animation on the highlighted word. Slogans > 90 chars use `.slogan-xlong` (smaller) so they never reach the 3D headline; on mobile every slogan size is reduced so lines wrap inside the screen.
- **Section pattern.** New section = standalone component with `@Input({ required: true }) language`, `OnPush`, `sectionRoot` ViewChild, and animation in a sibling `*-animation.ts` returning a cleanup function; call cleanup in `ngOnDestroy`. Register it in `AppComponent.imports` and its template.
- **Content as data.** Keep copy, years, names and image paths in typed `data/` files, not in templates.
- **Animation.** GSAP only. Respect `prefers-reduced-motion` (see `hero-star-handoff.ts`). Always kill timelines/ScrollTriggers/animation frames on destroy. Desktop breakpoint used in code is `min-width: 1101px`.
- **Theme.** `light-theme` class on `.hero-shell`; persisted in `localStorage['vck-theme']` ('dark' default). Brand colours: blue `#2785df`, red `#ed2a40`; dark bg `#07111f`, light bg `#f2f6fc`. Any new component needs both themes.
- **Accessibility.** Keep `aria-*` labels (also translated), `focus-visible` outlines, `aria-hidden` on decorative layers.
- **Images.** The hero portrait must be the supplied `thiruma.png`; never substitute another person's likeness (see `public/PORTRAIT-CREDIT.md`). Thinker images record `imageCredit` in data — fill it when sourcing images. Paths with spaces must be URL-encoded (`%20`).
- **Assets in the build.** `frontend/angular.json` copies `public/`, `assets/Ideology_leaders` and `assets/hero_section` only. A new asset folder must be added to `angular.json` `assets` or it will 404 in production.
- **SCSS only, no inline CSS.** No `styles: [...]` in components, no `style="…"` or `[style.x]` bindings in templates — use `styleUrl` pointing to a `.scss` file, classes and `[class.x]`. Templates are always external (`templateUrl`), never inline. Data-driven positions go in SCSS loops/maps (see `$history-node-count` in the history section; keep it equal to `HISTORY_MILESTONES.length`). Only GSAP/canvas runtime animation may set `element.style` from TypeScript.
- Code style: 2-space indent, single quotes, semicolons, explicit types on exported APIs, `readonly` signals.

## Deployment

GitHub Actions (`.github/workflows/deployment.yml`) on push to `main`, with `working-directory: frontend`: `npm ci` → `ng build --configuration production --base-href /website_v1/` → copies `index.html` to `404.html` (SPA fallback) → GitHub Pages. Therefore:

- Use **relative** asset URLs (`assets/...`, no leading `/`) so the `/website_v1/` base href works. `index.html` has `<base href="/">` for local dev.
- Hash-based/router links must account for the base href.

## Git / repo notes

- Branches: `main` (deploys), feature branches like `feature/dev_landing_page`.
- `.gitignore` excludes `node_modules/`, `dist/`, `.angular/`. Build output and caches are not tracked; never commit them.
- Commit messages so far are short lowercase descriptions of the change.

## Site map (planned)

**Current scope: Home / landing page only.** Do not build the other pages until the user says so. Every label is bilingual (EN / TA).

1. **Home – முகப்பு**: Home Page – முகப்புப் பக்கம்
2. **Movement – இயக்கம்**: Movement History – இயக்க வரலாறு · Leadership – தலைமை · Conferences – மாநாடுகள் · Achievements – சாதனைகள்
3. **Organisational Structure – இயக்கக் கட்டமைப்பு**: District Secretaries – மாவட்டச் செயலாளர்கள் · Elected Representatives (MLAs / MPs) – மக்கள் பிரதிநிதிகள் (எம்எல்ஏ / எம்பி) · Affiliated Organisations (All Wings) – துணைநிலை அமைப்புகள் (அனைத்து அணிகளும்)
4. **Field Activities – களத்தில் சிறுத்தைகள்**: Field Activities – களப்பணிகள் · Public Welfare Activities – மக்கள் நலப் பணிகள் · Protests and Agitations – போராட்டங்கள் · Photo Gallery – புகைப்படத் தொகுப்பு
5. **Elections – தேர்தல்கள்**: Our Tamil Land – நமது தமிழ்மண் · Election History – தேர்தல் வரலாறு · Year-wise Elections – ஆண்டு வாரியான தேர்தல்கள் · Constituency-wise Elections – தொகுதி வாரியான தேர்தல்கள் · Election Results – தேர்தல் முடிவுகள்
6. **Publications – வெளியீடுகள்**: Policies – கொள்கைகள் · Books – புத்தகங்கள் · Ideological Songs – கொள்கைப் பாடல்கள்
7. **Donate Us – நன்கொடை வழங்குங்கள்**: Donation Information – நன்கொடை விவரங்கள் · Make a Donation – நன்கொடை வழங்குதல்
8. **Contact Us – தொடர்புக்கு**: Office Address – அலுவலக முகவரி · Phone Number / Email – தொலைபேசி எண் / மின்னஞ்சல் · Contact Form – தொடர்புப் படிவம்

The `navigation` array in `app.component.ts` is an earlier draft and **does not yet match this site map** — align it when working on the nav. Menu items stay non-linked placeholders until their pages exist.

## Backend (planned)

A **Python backend** will be developed later in `backend/` (same repo; framework not chosen yet, likely FastAPI or Django). Only a README placeholder exists and nothing in the frontend calls an API today. Expected consumers: elections/results data, MLAs/MPs and secretaries lists, gallery, donations, contact form. Until then keep content in typed `data/` files shaped like future API responses, so swapping to HTTP (`HttpClient` + a service per domain) is easy. Decide API base URL config and CORS when it starts; update this section then. Note the frontend is deployed to static GitHub Pages, so the backend will need separate hosting.

## Status / roadmap

Done: opening animation, hero (portrait, 3D headline, relief portrait, slogans rotating, theme + language toggles, mobile menu), flag section, ideology (5 principles around a star), history timeline (from 1982), thinkers (Ambedkar, Periyar, Marx), handwritten signature in the hero.

Placeholder / TODO: nav menu items are non-linked `<li>` (no routing/pages); no content for MPs/MLAs, leadership, secretaries, wings; footer is minimal; no tests, SEO/OG tags, favicon, or analytics.

## Maintaining this file

Update CLAUDE.md in the same change whenever you: add/remove a section or top-level module, change commands/tooling/deploy, add a convention or decision, add a dependency, or finish/start a roadmap item. Keep it concise and factual; do not duplicate what the code makes obvious.
