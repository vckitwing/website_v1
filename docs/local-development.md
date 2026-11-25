# Running everything locally

Three things run side by side. Use three terminals.

## 1. One-time setup

```bash
cd backend
python -m venv .venv
.venv/Scripts/python -m pip install -r requirements.txt        # Linux/macOS: .venv/bin/python
# Option A, local PostgreSQL (recommended): asks for the 'postgres' password you set when installing PostgreSQL,
# creates a 'vck' user + database and writes backend/.env for you. The password never leaves your terminal.
.venv/Scripts/python scripts/setup_local_db.py
# Option B, SQLite (no install): cp .env.example .env
.venv/Scripts/python -m app.cli seed                            # loads today's History + Conferences into a local SQLite file
.venv/Scripts/python -m app.cli create-admin you@example.org "Your Name"   # asks for a password (10+ chars, upper + lower + number)

cd ../frontend
npm ci
```

### Books and the magazine

A PDF placed in `Object_Storage_Data/Books/` does not appear on the website by itself. Either upload it in the admin
(**Publications**), or import everything in that folder (from `backend`):

```bash
.venv/Scripts/python -m app.cli import-books --publish
```

`Books/amaipai_thiralvom/` is the book; `Books/thamizhman/` holds magazine issues. Name an issue like
`2026-11_issue101.pdf` so it gets its month, year and number. Running it again only adds new files.
A 559-page book takes about five minutes.

## 2. Start

| Terminal | Folder | Command | Opens at |
| --- | --- | --- | --- |
| API | `backend` | `.venv/Scripts/python -m uvicorn app.main:app --reload` | http://localhost:8000/docs |
| Public site | `frontend` | `npm start` | http://localhost:4200 |
| Admin | `frontend` | `npm run start:admin` | http://localhost:4300 |

Sign in to the admin with the account you created. Add more people (editor, contributor) under **Users**.

## 3. Try the whole flow

1. In the admin, open **History** or **Conferences**, add an item and **Publish** it.
2. Reload http://localhost:4200. The new item is in the timeline / conference rows (the headline year range and count update too).
3. **Unpublish** it, or save it as a draft: it disappears from the site.
4. Stop the API and reload the site: it still works, using the content built into it.

Contributors can only save drafts; an editor publishes them. Super admins also see **Users** and **Activity**.

## Tests

- API: `cd backend && .venv/Scripts/python -m pytest`
- Frontend: `cd frontend && npm run build` and `npm run build:admin` (strict template type-check)

## Notes

- Files live in `Object_Storage_Data/` at the repo root (git-ignored; your books, uploaded pictures under `images/`, and `content.json`). The API serves it at http://localhost:8000/media while you develop. Never commit that folder.
- The public site reads `http://localhost:8000/media/content.json` (`frontend/src/environments/environment.ts`), which the API rewrites whenever content is published. It waits at most
  2.5 s; if the API is down, slow or returns something unusable, it uses the built-in content. In production the address
  is the R2 media bucket's `content.json` (`environment.production.ts`); not set up yet.
- Pictures: sign in to the admin, open **Media**, upload a JPEG/PNG/WebP with a description in English and Tamil. It is saved in 3 web sizes under `Object_Storage_Data/images/`.
- `backend/vck.db` is your local database (not committed). Delete it and run `seed` again to start over.
