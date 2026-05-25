# Step 1 — Authentication UI

## Routes

| Path | Description |
|------|-------------|
| `/login` | Sign in |
| `/register` | Create account (CUSTOMER or PROVIDER) |
| `/customer/dashboard` | Protected customer shell |
| `/provider/dashboard` | Protected provider shell |
| `/admin/dashboard` | Protected admin shell |

## Env

`apps/web/.env.local`:

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api/v1
```

## Run

```bash
# Terminal 1 — backend on :3000
# Terminal 2 — frontend
cd RoadGuard-AI-Frontend
pnpm dev
# http://localhost:3001
```

Note: Login uses **email** (matches backend). ADMIN accounts cannot self-register.
