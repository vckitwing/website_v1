# Architecture and hosting plan

Status: **decided in outline** (Cloudflare for the frontend and storage, a small VPS for the API and database). Provider and domain details still open. Prices are rough (late 2026) and must be re-checked when buying. Nothing is deployed yet.

## Goals

1. Cheap: roughly Rs 500-800 a month.
2. Data that cannot be lost (database backups, files in object storage).
3. The public site stays up and fast even if the VPS is down.

## The picture

```
                         visitors                       admins
                            |                              |
                      Cloudflare (free plan): DNS, CDN, HTTPS, DDoS shield
                            |                              |
   +------------------------+--------+      +--------------+-----------------+
   | Cloudflare Pages: public site   |      | Cloudflare Pages: admin app      |
   |   yourdomain                    |      |   admin.yourdomain               |
   |                                 |      |   + Cloudflare Access login gate |
   +---------------+-----------------+      +--------------+-------------------+
                   |                                       |
        reads content.json                          calls the API
        and photos from R2                                 |
                   |                                       v
   +---------------v-----------------+      +-------------------------------+
   | Cloudflare R2 (object storage)  |<-----|  small VPS (India region)     |
   |  media.yourdomain  public       |      |  api.yourdomain               |
   |    photos + content.json        |      |  Caddy -> FastAPI (Docker)    |
   |  backups bucket    private      |      |  PostgreSQL (Docker, private) |
   |    encrypted nightly dumps      |      +-------------------------------+
   +---------------------------------+
```

(Domain name is a placeholder.)

## Decisions

### 1. Frontend: two builds, one repo (decided), on Cloudflare Pages

- `frontend/` holds two Angular projects in one workspace: `vck-website` (public) and `vck-admin`. One repo, one `npm ci`, one set of tools, but **two separate builds** (`npm run build`, `npm run build:admin`).
- Two Cloudflare Pages projects (free, unlimited bandwidth for static files): `dist/vck-website/browser` -> `yourdomain`, `dist/vck-admin/browser` -> `admin.yourdomain`. Both need a "send every unknown path to index.html" rule (the public site uses `/contact` and `/donate`; the admin uses its router): a `_redirects` file or Pages' single-page-app mode.
- Why not one app: the admin's global styles (bare `input`, `table`, `body`) would leak into the public site, the heavy WebGL front page would load for admins, and the public bundle would carry admin code.
- Code both sides need goes in one shared folder imported by both (not created yet: today the admin's types mirror the API and the public site's mirror `content.json`, so nothing is truly shared. Create `frontend/shared/` the first time a type is needed by both).
- **Deploying without GitHub:** the `wrangler pages deploy` command uploads a built folder straight from your machine (or any CI you choose later). GitHub is only used for testing.
- The admin sits behind **Cloudflare Access** (free up to 50 users): a login gate (email code or Google) before the admin app is even reachable, on top of the app's own login. It can also limit access to given people or networks.

### 2. Storage: Cloudflare R2

- No charge for downloads, S3-compatible, first 10 GB free; beyond that about $0.015 per GB per month (100 GB is about Rs 130).
- **`media` bucket** (public through `media.yourdomain`, cached by Cloudflare): Movement and gallery photos, books, later PDFs. It also holds **`content.json`**.
- **`backups` bucket** (private): encrypted nightly database dumps.
- **Photo uploads:** the admin sends a photo to the API, which checks type and size, makes web-sized WebP copies (e.g. 400 / 800 / 1600 px) and stores them in R2. The database keeps only the file's key and the captions in English and Tamil.
- **Local development:** the same code writes to a folder, so no Cloudflare account is needed to develop.

### 3. The public site never depends on the VPS

- Whenever an editor publishes, the API writes the published content as `content.json` **into R2** (today the code writes it to a local folder; this becomes a storage setting).
- The public site reads `https://media.yourdomain/content.json` (cached for about a minute). If the VPS is down, the site and its content keep working; only the admin pauses.
- The site still falls back to its built-in content if the file cannot be loaded (already built).

### 4. API + database: one small VPS in an India region

- **Ubuntu 24.04, Docker Compose, three containers:** Caddy (HTTPS, reverse proxy), FastAPI (2 workers), PostgreSQL. 1 GB RAM is enough to start; move to 2 GB when photo resizing arrives (about Rs 400-600 a month for 1 GB, Rs 800-1,000 for 2 GB).
- **PostgreSQL on the VPS, never exposed to the internet** (only the API container can reach it). A managed database costs more than the whole VPS; the code already runs on SQLite or PostgreSQL through one setting, so moving later means changing `DATABASE_URL`.
- `api.yourdomain` goes through Cloudflare (hides the server's address; caching is off for the API). The VPS firewall allows only Cloudflare's addresses on 443, SSH only from known addresses. A Cloudflare Tunnel (no open ports at all) is the alternative.
- **Backups are your job, so they are not optional:**
  - Nightly `pg_dump`, compressed and **encrypted**, to the private R2 bucket. Keep 30 daily + 12 monthly.
  - A weekly snapshot from the VPS provider (about +20% of the VPS price).
  - A restore drill before launch and after any big change. A backup nobody has restored is only a hope.

### 5. Security

- `SECRET_KEY`, database password and R2 keys live in a `.env` file on the server (never in git).
- Admin: Cloudflare Access + the app's own login; `noindex`; no link from the public site. Later: 2-step login (TOTP) for super admins and editors.
- API: CORS limited to the real site and admin addresses; docs and OpenAPI off in production (already automatic); login throttling (built).
- VPS: SSH keys only, automatic security updates, Docker restart policies.
- Monitoring: a free uptime check (e.g. UptimeRobot) on the site and on `/api/health`, with alerts to email or WhatsApp.

### 6. Deployment (no GitHub required)

- **Frontend:** `npm run build` then `wrangler pages deploy` (site), the same for the admin. A small script for each.
- **API:** a script that copies the code (or pulls a Docker image) to the VPS and runs `docker compose up -d`.
- No staging at first. If wanted later: a `staging.` Pages project plus a second API container on the same VPS.

## Rough monthly cost (India)

| Item | Cost |
| --- | --- |
| VPS, 1 GB RAM (DigitalOcean Bangalore, Lightsail Mumbai, Vultr, Hostinger) | Rs 400-600 (2 GB: 800-1,000) |
| Provider snapshots (weekly) | Rs 80-150 |
| Cloudflare: DNS, CDN, Pages, Access, DDoS | Rs 0 |
| Cloudflare R2 (under 10 GB) | Rs 0 (about Rs 130 per 100 GB) |
| Domain (already owned; renewal about Rs 700-1,100 a year) | about Rs 60-95 |
| Email sending for the contact form later (Brevo free tier, 300 a day) | Rs 0 |
| **Total** | **about Rs 500-800** (Rs 900-1,250 with a 2 GB VPS) |

A Europe-based VPS is cheaper per GB of RAM but adds noticeable delay for Tamil Nadu visitors on admin and API calls; an India region is the safer default. Long-term contracts (1-2 years) lower the monthly price but lock you in.

## Capacity check

The public site is static files on Cloudflare's network, so visitor spikes (an election, a viral post) do not touch the VPS. The VPS only serves the admins and the API calls that happen when content changes. If it ever outgrows one small VPS, the steps are a bigger VPS, then a managed database: no redesign needed.

## What I will build next

1. **Storage layer in the API:** local folder or R2 by setting; `content.json` written to it on publish; image resizing; upload endpoint; admin screen for photos.
2. `docker-compose.yml` (API, PostgreSQL, Caddy), Caddyfile, a server `.env.example`.
3. Backup script (encrypted `pg_dump` to R2), restore script, cron entry.
4. Deploy scripts for the two Pages projects and for the VPS, plus a server setup guide (firewall, SSH keys, updates).
5. Switch the public site's `contentUrl` to the R2 address and set the real API address in the admin.

## Still open

- Domain: registrar, whether it has email on it, who can change nameservers (Cloudflare needs them).
- VPS provider and region.
