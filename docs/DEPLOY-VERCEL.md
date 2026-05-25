# Deploy frontend on Vercel

## Project settings (must match `vercel.json`)

| Setting | Value |
|---------|--------|
| **Root Directory** | `apps/web` |
| **Framework** | Next.js |
| **Build Command** | (from `vercel.json`) `pnpm turbo run build --filter=@roadguard/web` |
| **Install Command** | `pnpm install` (runs from repo root when Root Directory is `apps/web`, Vercel still clones full repo) |
| **Output Directory** | `.next` (not `apps/web/.next` — that doubles the path) |

If **Root Directory** is left empty (repo root), set **Output Directory** to `apps/web/.next` instead and use `outputDirectory` in root `vercel.json` accordingly.

## Environment variables (Production)

| Key | Example |
|-----|---------|
| `NEXT_PUBLIC_API_BASE_URL` | `https://roadguard-api.onrender.com/api/v1` |
| `NEXT_PUBLIC_SOCKET_URL` | `https://roadguard-api.onrender.com` |
| `NEXT_PUBLIC_SOCKET_PATH` | `/socket.io` |

Redeploy after changing `NEXT_PUBLIC_*` (baked in at build time).

## Backend CORS

On Render, set `CORS_ORIGIN` to your Vercel URL, e.g. `https://your-app.vercel.app`.
