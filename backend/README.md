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
- With `PUBLISH_DIR` set, every change also rewrites `<dir>/content.json`, so the public site can read static JSON.

## Production

Set `ENVIRONMENT=production`, a random `SECRET_KEY` (32+ chars; the app refuses to start otherwise) and a PostgreSQL
`DATABASE_URL`. The interactive docs are disabled in production. See `../docs/hosting-plan.md`.
