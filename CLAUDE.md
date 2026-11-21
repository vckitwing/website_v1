# CLAUDE.md

Guidance for Claude Code when working in this repository. **Keep this file current** — see "Maintaining this file" at the bottom.

## Project

Official website for **Viduthalai Chiruthaigal Katchi (VCK)**, a Tamil Nadu political party. A single-page, scroll-driven, animation-heavy, **bilingual (English / Tamil)** site with dark/light themes. Currently only the landing page is in scope; see "Site map (planned)" for the full planned structure and "Backend (planned)" for the Python API.

## Tech stack

- Angular 22 (standalone components, signals, `OnPush`, no NgModules, no router yet) — `@angular/build:application` builder
- TypeScript 6, `strict` + `strictTemplates`
- GSAP 3 (+ `ScrollTrigger`, dynamically imported) for all animation
- three.js 0.180 (hero star network / particles, and the 3D headline). Plain three.js is used rather than Angular Three, to match the existing `HeroStarNetwork` pattern and avoid a new dependency.
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
      hero/                            hero-star-network, hero-portrait-reveal,
                                       hero-star-handoff, opening-animation, hero-typography.scss
        typography/                    3D headline: hero-typography-3d.ts (three.js class) and
                                       hero-headline-outlines.ts (GENERATED glyph outlines)
      sections/<name>/                 flag, ideology, history, thinkers
        <name>-section.component.{ts,html,scss}
        <name>-animation.ts            GSAP/ScrollTrigger timeline factory for that section
        data/                          Typed content + types (en/ta)
    pages/<future>/                    One folder per future page from the site map
    shared/                            Cross-page code (import via `@shared/...` alias)
      story/                           star-journey.ts, flag-star-geometry.ts
      theme-switch-transition/         Theme change overlay component
frontend/tools/    Dev-time Node scripts (generate-typography-outlines.mjs)
frontend/assets/   Source images (Ideology_leaders, Logo, hero_section, portraits, book_assets, vendor)
frontend/public/   Served at site root (portraits/, assets/Logo/)
```

### Conventions

- **Bilingual everywhere.** Every user-visible string needs `en` and `ta` variants. Content lives in `data/` files (`{ en, ta }` objects, or separate `*.en.ts` / `*.ta.ts` as in ideology). Template strings in `app.component.ts` use `language() === 'ta' ? … : …`. Never ship an English-only string. Tamil text uses `Noto Sans Tamil` / `Anek Tamil`; test line wrapping.
- **3D hero headline** ("ORGANIZE AND UNITE" / "அமைப்பாய்த் திரள்வோம்"). Real extruded three.js geometry (`HeroTypography3D`), lazy-loaded from `AppComponent.ngOnInit`, in a `<canvas class="hero-headline-3d">` behind the portrait. API: `reveal()` (after the opening animation), `setLanguage()`, `setTheme()`, `destroy()`. It handles pointer parallax, float, reduced-motion (static frame), pausing off-screen, and compact/mobile quality. Tamil needs complex-script shaping that `TextGeometry` can't do, so glyph outlines are pre-shaped at dev time with `fontkit` into `hero-headline-outlines.ts` — **never edit that file by hand**; to change the text or fonts edit `tools/generate-typography-outlines.mjs` and run `npm run generate:headline` (fonts come from the `@fontsource/anek-tamil` and `@fontsource/montserrat` devDependencies, OFL). The frontend is Node/Angular only — no Python. Layout/lighting constants live in `HERO_TYPOGRAPHY_CONFIG`. Desktop: the copy block sits at the bottom-left under the headline; mobile: the headline is pinned to the top and `.hero-copy` has top padding to make room (both in `hero-typography.scss`).
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

Done: opening animation, hero (portrait, star network, slogans rotating, theme + language toggles, mobile menu), flag section, ideology (5 principles around a star), history timeline (from 1982), thinkers (Ambedkar, Periyar, Marx).

Placeholder / TODO: nav menu items are non-linked `<li>` (no routing/pages); no content for MPs/MLAs, leadership, secretaries, wings; footer is minimal; no tests, SEO/OG tags, favicon, or analytics.

## Maintaining this file

Update CLAUDE.md in the same change whenever you: add/remove a section or top-level module, change commands/tooling/deploy, add a convention or decision, add a dependency, or finish/start a roadmap item. Keep it concise and factual; do not duplicate what the code makes obvious.
