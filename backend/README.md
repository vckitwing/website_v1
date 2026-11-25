# VCK website API (phase 1)

FastAPI + SQLAlchemy. SQLite for local work, PostgreSQL in production (one setting: `DATABASE_URL`).
Manages the content that the public site shows (History, Conferences) and the people who may edit it.

## Run it locally

```bash
cd backend
python -m venv .venv
.venv/Scripts/python -m pip install -r requirements.txt     # Windows; on Linux/macOS use .venv/bin/python
cp .env.example .env
.venv/Scripts/python -m app.cli seed                        # loads today's History + Conferences (empty tables only)
.venv/Scripts/python -m app.cli create-admin you@example.org "Your Name"
.venv/Scripts/python -m uvicorn app.main:app --reload       # http://localhost:8000/docs
.venv/Scripts/python -m pytest                              # tests
```

## Roles

| Role | Can do |
| --- | --- |
| `super_admin` | Everything, plus manage users and read the audit log. The last active super admin cannot be demoted or deactivated. |
| `editor` | Create, edit, delete, publish and unpublish content. |
| `contributor` | Create drafts, edit/delete drafts. Cannot publish, and cannot touch published items. |

Items are `draft` or `published`. Only published items reach the public site. Every change is written to the audit log.
Both English and Tamil are required for every text field.

## API

- `POST /api/auth/login` -> bearer token (8 h). 5 failed logins per email block it for 15 minutes.
- `GET /api/auth/me`, `POST /api/auth/me/password`
- `GET/POST /api/conferences`, `GET/PATCH/DELETE /api/conferences/{id}` (same shape for `/api/history`)
- `GET/POST /api/users`, `PATCH /api/users/{id}`, `GET /api/users/audit/log` (super admin)
- `GET /api/public/content` — all published content, no sign-in (same shape as the website's data files)
- `GET/POST /api/media`, `PATCH/DELETE /api/media/{id}` — picture library. Anyone signed in can upload; editing and deleting are for editors.
  An upload (multipart: `file`, `alt_en`, `alt_ta`, optional captions) must be a real JPEG / PNG / WebP up to 10 MB and 60 megapixels;
  it is re-encoded to WebP copies 400 / 800 / 1600 px wide (never larger than the original; camera data such as GPS is dropped) and stored as
  `images/<id>/<width>.webp`. Both descriptions (English, Tamil) are required.
- Object storage (`app/storage.py`): locally a folder (`STORAGE_DIR`, default `<repo>/Object_Storage_Data`, git-ignored) that the API also serves
  read-only at `/media` in development. Every change to published content rewrites `content.json` in it, which is what the public site reads
  (`http://localhost:8000/media/content.json` locally; the R2 media bucket in production). The same five methods (`put`, `delete`, `delete_prefix`, `exists`, `url`) will get an R2 implementation.

## Production

Set `ENVIRONMENT=production`, a random `SECRET_KEY` (32+ chars; the app refuses to start otherwise) and a PostgreSQL
`DATABASE_URL`. The interactive docs are disabled in production. See `../docs/hosting-plan.md`.
