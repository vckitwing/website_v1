# Hosting plan (admin + API on a VPS)

## Shape

```
vckwebsite.org            public site (GitHub Pages, static) -- reads published content.json
admin.vckwebsite.org      admin app (static files served by Caddy on the VPS)
api.vckwebsite.org        FastAPI + PostgreSQL on the VPS (behind Caddy, automatic HTTPS)
```

(Domain name is a placeholder. Subdomains are just DNS "A" records pointing at the VPS.)

## What to buy

- A small Linux VPS, **Ubuntu 24.04 LTS**, 1-2 vCPU, 2 GB RAM, 25+ GB disk. India region if the audience is in Tamil Nadu
  (Mumbai / Chennai / Bangalore). Roughly Rs 400-900 / month. Providers that fit: DigitalOcean (Bangalore), AWS Lightsail
  (Mumbai), Hostinger VPS, Vultr (Mumbai/Bangalore).
- A domain you control (you need to edit its DNS).
- **Off-server backup storage** (Cloudflare R2 or Backblaze B2, a few rupees a month).

## One-time setup (I will script this)

1. Create the server, add your SSH key, turn off password login, turn on the firewall (only ports 22, 80, 443).
2. Install Docker. Run three containers with Docker Compose: PostgreSQL, the API, Caddy.
3. Caddy gets free HTTPS certificates for `api.` and `admin.` by itself.
4. Create the first super admin with `python -m app.cli create-admin`.

## Backups (do not skip)

- Nightly `pg_dump`, compressed, uploaded to the off-server bucket, keep 30 days.
- Test a restore once before going live.

## Public site and the backend being down

The API writes `content.json` after each change. Publish it to a place the public site can fetch (a file on Caddy, or a bucket).
The public site falls back to its built-in data if the fetch fails, so visitors never depend on the API.

## Security checklist

- Strong `SECRET_KEY`, `ENVIRONMENT=production`, API docs off (already automatic).
- Admin only over HTTPS, `noindex`, no link from the public site.
- Limit `CORS_ORIGINS` to the real admin and public domains.
- Keep the server updated (`unattended-upgrades`), review the audit log.
- Later: 2-step login (TOTP) for super admins and editors.
