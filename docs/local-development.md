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

- The public site asks the API for `GET /api/public/content` (`frontend/src/environments/environment.ts`). It waits at most
  2.5 s; if the API is down, slow or returns something unusable, it uses the built-in content. In production the address
  is `content.json` next to the site (`environment.production.ts`); nothing publishes that file yet.
- The API caches the public content for 60 seconds, so a published change can take up to a minute to reach visitors.
- `backend/vck.db` is your local database (not committed). Delete it and run `seed` again to start over.
