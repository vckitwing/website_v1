# Plan: Books (Amaipai Thiralvom) and the monthly "Namathu Thamizhman"

Status: **plan, not built.** Written for the site owner and whoever builds it. Answers from the owner are marked (decided).

## What the two PDFs turned out to be

| | Amaipai Thiralvom | Namathu Thamizhman (`Books/thamizhman`) |
| --- | --- | --- |
| What | One book: "அமைப்பாய்த் திரள்வோம்: கருத்தியலும் நடைமுறையும்", Thol. Thirumavalavan | A monthly magazine, "நமது தமிழ்மண்" (the sample is Vol 9, Issue 100, Feb 2015) |
| Pages | **559** | 48 |
| PDF size | 4.6 MB | 15.9 MB |
| Text inside | Real, selectable text (a Google Docs export), so a PDF would let anyone copy it | None: every page is a picture |
| Rendered page size at 1400 px wide | about 177 KB, **about 96 MB for the whole book** (about 60 MB at 1100 px) | about 222 KB, about 10 MB per issue |
| Cover | Page 1 is a proper cover: black, a coloured leaf mark, the title and the author's name. It works as the 3D book's front. | Page 1 is the magazine cover |

**Problem found in the Thamizhman file.** It is a *browser print of a FlipHTML5 page*: every page carries a print header ("Flip PDF Download | FlipHTML5", date and time) and a footer (the fliphtml5.com address and "1/48"). Without handling, that would show on every page and on the cover. Fix: ask the magazine team for the original print-ready PDF each month; until then the pipeline crops a configurable top and bottom band per publication.

## Decisions

1. **Amaipai Thiralvom: a floating 3D book** the visitor can click to open and read. (decided)
2. **Source language is Tamil; English is machine-translated** with a free translator, reviewed by a person. (decided)
3. **Visitors can read but not download or copy the text.** (decided)
4. **Covers are generated from the first page.** (decided)
5. **Thamizhman goes under Publications → "Our Tamil Land"** (நமது தமிழ்மண்). It was in the site map under Elections; that entry moves. (decided)
6. **The magazine team will send the original PDF each month** (so no FlipHTML5 header and footer). The crop option stays only as a fallback. (decided)
7. **The whole book gets an English edition, translated page by page** with a free translator. (decided; see below)
8. **A faint watermark on every page.** (decided)
9. **The party confirms it can publish the book and the magazine's photos online.** (decided)
10. **Name and address:** "Namathu Thamizhman" (நமது தமிழ்மண்), `/tamil-land`. (decided)
11. **The 3D book has its own page under Publications** ("Publications > Amaipai Thiralvom", address `/amaipai-thiralvom`), not a general Books page. (decided)
12. **Translator: decide later.** The English edition is designed (below) but not built yet; no provider is chosen. (decided)
13. **The magazine is Tamil only** (no English edition, no OCR). (decided)

## How "read, not download or copy" works, and what it cannot do

- The PDF is never given to visitors. On upload the server turns every page into a WebP picture (about 1100 px wide, a little over 100 KB) and stores those in the **public** storage. The original PDF goes to a **private** place that is never served.
- The reader shows the pictures. A picture has no text to select or copy, there is no "save as PDF" button, and the image addresses are random (not guessable, not a numbered list).
- The reader also turns off right-click, dragging and text selection, and Cloudflare's free hotlink protection stops other sites from embedding the images.
- Optional, per publication: a faint watermark (the site address) drawn into each page when it is processed.
- **What it cannot do (be honest with the party):** nothing can stop a determined person taking a screenshot or photographing the screen. This removes the easy routes (download, copy text, share the file), not every route.
- **Accessibility cost:** picture-only pages cannot be read by screen readers. Mitigation: a written synopsis of each book (English and Tamil) next to the reader, and, if the party wants, an accessible text version on request later.
- **Fix needed first:** today the development server shows the whole `Object_Storage_Data` folder at `/media`, so `Books/…pdf` is downloadable in development. The public mount must serve only public areas (pictures, page images, `content.json`) and never the source PDFs. Production uses two separate R2 buckets, so this cannot happen there.

## The pieces

### Backend (FastAPI, same API)

- **Tables:** a `publication` (slug, kind `book` or `monthly`, title and description in Tamil and English, status draft or published) and its `editions`: for a book, one; for Thamizhman, one per month (volume, issue number, month and year, page count, cover, status, a "processing / ready / failed" state).
- **Upload** (editors and super admins; a contributor can prepare one for an editor to publish): accepts only a real PDF (checked by content, not by name), up to about 80 MB and 800 pages.
- **Processing** (page by page, so memory stays small, using `pypdfium2`, which handled both files and the Tamil text correctly in the test): creates the page pictures, a 600 px cover from page 1, and records the page count. Amaipai Thiralvom takes several minutes (559 pages), so it runs as a background job with a live "120 of 559" counter, and a **Retry** button if the server restarts mid-way.
- **Storage keys:** public `books/<edition-id>/p001.webp …` and `cover.webp`; private `private/books/<edition-id>/source.pdf`.
- **`content.json`** gains the published books and issues (title, cover address, page count, page address pattern), so the website never needs the API to show them.
- **Translate endpoint:** `POST /api/translate` (editors and above, limited to about 5,000 characters and 30 requests a minute per person, written to the activity log without storing the text).

### Admin

- **Books** page in the side menu. A list of publications; for Thamizhman an "Add issue" button (pick month and year, upload the PDF, see the progress, check the generated cover, publish).
- **Translate to English** button beside each Tamil field. It fills the English field and marks it "machine-translated, needs review"; **publishing is blocked until a person ticks "reviewed"**. This is deliberate: we have already seen machine and OCR errors in our own content ("Eradication of Religion" instead of "Alcohol and Drugs").
- **Provider (my recommendation):** Google Cloud Translation basic (500,000 characters a month free) or Azure AI Translator free tier (2 million a month); both need an account with a card for verification, neither charges inside the free allowance, and the API key stays on the server. Zero-signup options (MyMemory about 5,000 characters a day; LibreTranslate self-hosted) are weaker for Tamil. Titles and descriptions need only a few thousand characters a month.
### English edition of the whole book (decided: translate all of it, page by page)

- **How much text:** Amaipai Thiralvom has a text layer of **866,843 characters** (about 1,550 a page, 2 near-empty pages).
- **Job:** an editor presses **Create English edition** in the admin. A background job (resumable, paced, with a live "120 of 559" counter, like the page-picture job) does, for each page:
  1. read the Tamil text from the PDF, with font sizes so headings and page numbers can be recognised;
  2. split into paragraphs and translate them, applying a **glossary** of names and terms (Viduthalai Chiruthaigal Katchi, Thol. Thirumavalavan, Panchami land, and so on) so they are not mistranslated;
  3. keep the English text privately and **draw an English page picture** (same size, same watermark) into public storage as `books/<edition-id>/en/p001.webp`.
  Visitors never receive English text either, only the picture, so the "read, not copy" rule holds for both languages.
- **Page by page:** pages appear in the reader as soon as they are done; a page not yet translated shows "English coming". Nothing is translated on demand by a visitor (that would let the public spend your free allowance).
- **Reader:** a **Tamil | English** switch. English pages carry the note "Machine translation. The Tamil original is authoritative."
- **Review without proofreading 559 pages:** an editor can open any page's English text in the admin, correct it and re-draw just that page. Key chapters can be proofread first.
- **Honest limits:** English pages are typeset from plain text, so the original layout (indents, fonts, any tables) is not reproduced. Machine translation of an ideological book will miss idioms and terms; nobody can realistically proofread all 559 pages, hence the label.
- **The magazine:** its pages are pictures, so there is no text to translate. English would need OCR (Tesseract has a Tamil model), which is unreliable on magazine layouts and stylised headlines. The original PDFs from the team may carry real text (usual if exported from a layout program); check with the first one, then decide.

### Translator: recommendation

| Option | Free allowance | Whole book (866,843 characters) | Notes |
| --- | --- | --- | --- |
| **Azure AI Translator, free tier F0 (recommended)** | about 2,000,000 characters a month (check the current limit) | **about 43% of one month** | Good Tamil quality, supports a custom dictionary for names, does not bill inside the free tier. Needs a Microsoft account with a card for verification. Also covers the small monthly needs afterwards. |
| Google Cloud Translation, basic | 500,000 characters a month | about 1.7 months (do half, wait, do the rest) | Often the strongest on Tamil; needs a billing account (card). |
| IndicTrans2 (AI4Bharat, open source, runs on this PC) | unlimited, no account, no card | slower (hours) and a heavier set-up | Built for Indian languages, MIT-licensed; nothing leaves your machine. Check whether the model download needs a sign-in. |
| MyMemory / LibreTranslate | about 5,000 characters a day / self-hosted | not practical | Weaker for Tamil. |

The text of the book is sent to the provider while it is translated (Azure and Google do not use it to train their models under their business terms; check this against the party's comfort). The API key stays on the server and is limited to editors.

### Public site

- **Navigation:** Publications menu gets **Books** (`/books`) and **Our Tamil Land** (`/tamil-land`); they become real pages like Contact and Donate (home sections stay mounted behind them, as today).
- **Books page:** the floating 3D book (below) with the title, author, a short description and a "Read" button that does the same as clicking the book.
- **Our Tamil Land page:** the latest issue large, then an archive grid by year and month, each with its generated cover. Clicking opens the reader.
- **Both languages:** page text follows the site language. The reader shows the book as it is (Tamil).

### The floating 3D book (three.js, already in the project)

- A book shape with thickness: front and back covers, a spine, and a page block. Front cover = the generated first page. A gentle float and tilt, plus a slight turn toward the pointer (a finger on phones).
- **Click:** the book moves to the centre and the cover swings open (GSAP), then fades into the reader.
- **Fallbacks:** reduced motion or no WebGL shows the flat cover as a button; the page is fully usable without the 3D. Pauses when off screen. It will be its own page view, so it does not add to the home page's WebGL limit.

### The reader (one reader for both)

- A page-turning reader: two pages side by side on a desktop, one page on a phone. Next and previous by click, swipe or arrow keys; a page slider and "go to page"; zoom; full screen; remembers where you stopped.
- **Built for 559 pages:** only the current spread and a few pages either side are on the page at once, loaded as you go, so opening the book costs about the cover and first two pages (a few hundred KB), not 60 MB. For this reason I would build the page-turn with the existing GSAP rather than adopt a flipbook library that puts every page in the document.

## Build order (each step tested before the next)

1. **Backend:** tables, PDF upload, page processing with progress, private/public storage split, the `/media` fix, tests (including a fake PDF being refused and the source PDF not being reachable). About a day.
2. **Admin:** Books page, Add issue with progress, cover preview, publish; Translate button and the reviewed rule. About a day.
3. **Public: the reader and "Our Tamil Land"** (needed by both books). About a day.
4. **Public: the 3D book and "Books"** page. About a day.
5. **Loading the real files:** upload Amaipai Thiralvom and the Thamizhman issue through the admin and check every page, in both themes and on a phone.

## Build order now

Because of decisions 12 and 13, the English edition is left out of the first build. The data model keeps a place for a second language of page pictures so it can be added later without rework.

1. **Backend: done and tested** (27 tests on SQLite and PostgreSQL): tables, PDF upload, page processing with progress and retry, watermark, the public/private storage split and the `/media` fix. Measured on the real files: Amaipai Thiralvom 559 pages in about 5 minutes, 77.5 MB of page pictures; one Thamizhman issue 48 pages in 27 seconds, 8.9 MB. Tamil renders correctly; the watermark is faint and readable through.
2. **Admin: done and tested in a real browser** (32 checks, with a real scratch API): the Publications page in the side menu: create a book or a monthly magazine (web address name suggested from the title), Add issue / Add edition with an upload percentage, a live "x of N pages" progress bar while the page pictures are made (the list refreshes itself), cover thumbnail, Publish / Unpublish (disabled until ready), Retry for a failed job, Edit details, Delete (removes the files too). A fake PDF is refused with a message and nothing is stored. Contributors can upload an issue but get no Edit, Publish, Delete or Retry buttons. On phones each edition becomes a small card so the buttons stay in view.
3. **Public: the reader and "Our Tamil Land": done and tested in a real browser** (47 checks, real 48-page issue). `/tamil-land` shows only the LATEST issue (no archive, by the owner's choice) with a cover that opens the reader. The reader is a full-screen dialog: two pages that turn like a book on wide screens (the cover alone at the start, the book re-centres at the end), one page with swipe on phones, arrows / keys (arrows, Home, End, +, -, Esc), a page slider and go-to-page, zoom, full screen, remembers the page, loads only the pages near the current one (6 requests on opening, not 48), no right-click, no drag, no selection, hidden when printing, no link to a PDF anywhere, focus kept inside, Tamil and English labels. **Update:** the owner then asked for the opposite of "no archive": below the latest issue there is an **Earlier issues** section with every older issue, 8 per page, searchable by month and year (verified with 23 issues: pages, filters, no-result message, Tamil, phone).
4. **Public: the 3D book page "Amaipai Thiralvom": done and tested** with the real 559-page book (software WebGL in a real browser): the book floats and leans to the pointer, hovering shows the pointer cursor, clicking swings the cover open and then opens the reader, closing closes the book; the cover's white page margin is trimmed so a black cover looks like a hard cover; the spine carries the Tamil title; flat-cover fallback without WebGL; still image with reduced motion; phone: book first, tap opens one-page reader. The media bucket in production needs CORS for the site address (the cover is a WebGL texture).
5. **Loading the real files: done locally** with `python -m app.cli import-books --publish` (the book, 559 pages, and Thamizhman Vol 9 Issue 100). Our Tamil Land lists all issues. (The floating book was tried as a home page section and removed at the owner's request.) Checking every page by eye is still to do.

## Open questions

None blocking. Later: the translator and who opens its account.
