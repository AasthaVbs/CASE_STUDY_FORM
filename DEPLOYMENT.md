# Deploying frontend and backend separately

This app is a **Vite + React** single-page app (SPA) and an **Express + MongoDB** API. You can host them on different domains (for example UI on Netlify/Vercel and API on Railway/Render) without changing application code beyond environment variables.

---

## How it fits together

| Piece | Role | Typical host |
|--------|------|----------------|
| **Frontend** | Static files from `npm run build` (`dist/`) | CDN / static host (Netlify, Vercel, S3+CloudFront, nginx) |
| **Backend** | Node process: REST API, JWT auth, uploads, MongoDB | VPS, Railway, Render, Fly.io, Azure App Service, etc. |
| **MongoDB** | Database | MongoDB Atlas, or self-hosted |

- **Local dev:** `npm run dev` runs Vite on port **5173** and proxies `/api` to the API on **3001** (see `vite.config.js`). You do **not** set `VITE_API_URL` locally.
- **Split production:** the browser loads the UI from **HTTPS origin A** and calls the API on **HTTPS origin B**. You must:
  1. Build the frontend with **`VITE_API_URL`** set to the public API base URL (no trailing slash).
  2. Configure the API with **`CORS_ORIGINS`** including the UI origin(s).
  3. Keep **MongoDB** reachable from the API only (never expose the DB to the public internet without auth).

---

## Backend (API) deployment

### 1. Requirements

- **Node.js LTS** (recommended 20 or 22). This project pins `>=20 <23` in `package.json` to avoid non-LTS runtime issues.
- **MongoDB** connection string (Atlas recommended for production)

### 2. Environment variables (API server)

Create a `.env` on the server (or use your host’s “Environment variables” UI). Do **not** commit real secrets.

| Variable | Required | Example / notes |
|----------|----------|------------------|
| `MONGODB_URI` | Yes | `mongodb+srv://user:pass@cluster.mongodb.net/...` |
| `MONGODB_DB` | No | Default `case_study_crm` |
| `JWT_SECRET` | **Yes in production** | Long random string (signs auth tokens) |
| `ADMIN_EMAIL` | Optional | Bootstrap admin; reserved from self-registration |
| `ADMIN_PASSWORD` | Optional | Used with `ADMIN_EMAIL` on first boot |
| `API_PORT` | No | Default `3001`. If unset, **`PORT`** is used (common on Railway, Render, Heroku). |
| `HOST` | No | Default `0.0.0.0` (listen on all interfaces; needed for containers) |
| `CORS_ORIGINS` | **Recommended in prod** | Comma-separated UI origins, e.g. `https://app.example.com,https://www.example.com`. If unset, any browser origin is allowed (fine for dev). |
| `TRUST_PROXY` | Optional | Set to `1` if the API sits behind HTTPS reverse proxy (nginx, Railway, etc.) |
| `UPLOAD_MAX_BYTES` | No | Max upload size in bytes for `/api/upload` |

**Note:** `VITE_*` variables are **only** used when **building** the frontend, not when running Node. The API does not read `VITE_API_URL`.

**Port:** The server uses **`API_PORT`**, or **`PORT`** if `API_PORT` is not set, then defaults to `3001`.

### 3. Install and run

From the project root (same `package.json` on the server):

```bash
npm ci --omit=dev
```

(Use `npm install --production` if you prefer; `ci` is stricter for reproducible deploys.)

Start:

```bash
npm start
# or
npm run start:api
```

Health check:

```bash
curl https://YOUR-API-HOST/api/health
```

Expect JSON like `{ "ok": true, "service": "case-study-form-api", "db": "mongodb" }`.

### 4. Static files and uploads

- The API serves **`public/`** from the repo (Express `static`), including uploads under **`/images/case-study/`**.
- Deploy the **repo** (or at least `server/`, `public/`, `package.json`, `package-lock.json`) so `public/images/case-study` exists and stays writable if your host uses persistent disk for uploads.
- If the API is redeployed without persistent storage, **uploaded images may be lost** unless you use external object storage (S3, etc.) — that would require a future code change.

### 5. Process manager (optional)

Example **PM2** on a VPS:

```bash
npm ci --omit=dev
pm2 start server/index.js --name case-study-api
pm2 save
```

### 6. Reverse proxy (optional)

- Terminate TLS at nginx/Caddy/ALB.
- Proxy `https://api.example.com` → `http://127.0.0.1:API_PORT`.
- Set `TRUST_PROXY=1` on the API.

---

## Frontend (static UI) deployment

### 1. Build with the API URL baked in

The client uses **`VITE_API_URL`** at **build time** (see `src/utils/api.js` and `src/utils/caseStudyFieldHelpers.js`):

- All `/api/...` requests go to `VITE_API_URL + "/api/..."`.
- Image paths under `/images/case-study/` are prefixed with the same base when `VITE_API_URL` is set, so previews work when the UI and API are on different hosts.

**Windows (PowerShell):**

```powershell
$env:VITE_API_URL="https://api.yourdomain.com"
npm run build
```

**macOS / Linux:**

```bash
export VITE_API_URL=https://api.yourdomain.com
npm run build
```

**CI (GitHub Actions example):**

```yaml
env:
  VITE_API_URL: https://api.yourdomain.com
run: npm ci && npm run build
```

Output is in **`dist/`**. Upload `dist/` contents to your static host (not the `dist` folder name itself unless your host expects it).

### 2. SPA routing

The app uses **React Router** (`BrowserRouter`). Every path (e.g. `/form/demo-case-study`) must serve **`index.html`**. Configure your host:

- **Netlify:** `_redirects` or `netlify.toml` — `/* /index.html 200`
- **Vercel:** `rewrites` in `vercel.json` — `{ "source": "/(.*)", "destination": "/index.html" }`
- **nginx:** `try_files $uri $uri/ /index.html;`
- **S3 + CloudFront:** error document to `index.html` for 404s, or CloudFront function to rewrite

### 3. CORS

After deploying the UI, add its **exact** origin (scheme + host + port, no path) to **`CORS_ORIGINS`** on the API, e.g.:

`https://my-app.netlify.app`

Redeploy or restart the API after changing CORS.

### 4. Subpath deployment (optional)

If the site is not at the domain root (e.g. `https://example.com/crm/`), set Vite **`base`** in `vite.config.js` (e.g. `base: '/crm/'`) and rebuild. That is separate from `VITE_API_URL`.

---

## Checklist (split deploy)

1. [ ] MongoDB Atlas (or other) reachable from the API server IP / allowlist.
2. [ ] API `.env`: `MONGODB_URI`, `JWT_SECRET`, `CORS_ORIGINS` (UI origins).
3. [ ] API `GET /api/health` returns `ok: true`.
4. [ ] Frontend built with **`VITE_API_URL=https://your-api-host`** (no trailing slash).
5. [ ] Static host **SPA fallback** to `index.html`.
6. [ ] Browser login / form load — if CORS errors appear, fix `CORS_ORIGINS` (exact origin match).

---

## Same server (optional)

You can still serve **`dist/`** from the same Express app as the API (not configured in this repo by default). In that case you would:

- Serve `dist` at `/` and keep `/api` routes — **no `VITE_API_URL`** needed for that build (same origin).
- Uploads would still be under the same host as `/images/...`.

---

## Troubleshooting

| Symptom | What to check |
|--------|----------------|
| `Network` / CORS errors on `/api/...` | `CORS_ORIGINS` includes the UI origin; API restarted. |
| API calls go to wrong host | Rebuild frontend with correct `VITE_API_URL`. |
| Images broken on split deploy | `VITE_API_URL` set at build time; API serves `/images/case-study/...`. |
| `401` on login | `JWT_SECRET` stable across restarts; same API instance. |
| Mongo errors | URI, network access, Atlas IP allowlist. |

### Render-specific note

- If logs show Node `25.x`, switch to an LTS runtime (20 or 22). On Render, set `NODE_VERSION=22` in Environment or use a `.nvmrc` with `22`.
- Then redeploy with `Clear build cache & deploy`.

---

## Security reminders

- Rotate `JWT_SECRET` and re-login all users if it leaks.
- Never expose MongoDB credentials to the browser.
- Use HTTPS everywhere in production.
