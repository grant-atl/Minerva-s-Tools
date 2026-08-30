# Base44 Dev Environment — Minerva's Tools

## What this is
A single-page frontend app: React 18 + TypeScript + Vite 5 + React Router + Tailwind/Radix UI.
No backend, no database, no external services, no secrets required.

## Running it
```
docker compose -f docker-compose.base44.yml up -d
```
- Service `web` uses `node:22`, bind-mounts the repo at `/app`, runs `npm install` then `npm run dev`.
- Vite dev server listens on container port **8080**, mapped to host port **3000** (the preview entry point).
- Live reload is active; edits appear in the preview without a rebuild.

## Quirks / gotchas
- **`npm ci` does NOT work** — the committed `package-lock.json` is out of sync with `package.json` (picomatch mismatch). The compose uses `npm install` instead, which reconciles the lockfile. Do not switch back to `npm ci`.
- **Vite host check** — `vite.config.ts` sets `server.allowedHosts: true` so the preview's external hostname is accepted. Without it Vite returns 403 to the proxy Host header.
- The `node_modules` directory is a named volume (`app_node_modules`), kept separate from the bind mount so the host's lack of `node_modules` doesn't interfere.

## Verifying it works
```
curl -sf -H "Host: external-preview.example.com" http://localhost:3000/   # → 200, HTML with /@vite/client
```
A 200 with the Vite HMR client script confirms live source (not a prebuilt bundle).

## Other commands
- `npm test` — Vitest suite (shared utils, tool registry, routes, SEO, a11y).
- `npm run lint`, `npm run build` — quality checks.
