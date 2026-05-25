# Road Guard — Frontend Monorepo

AI-powered roadside assistance & vehicle breakdown platform.

> This repository contains the **frontend** for Road Guard. The backend lives in `../RoadGuard-AI-Backend`.

---

## What's in this repo

```
RoadGuard-AI-Frontend/
├── apps/
│   └── web/         ← Next.js 15 App Router (customer + provider + admin portals)
├── packages/        ← Shared, platform-agnostic libraries
│   ├── ui/          ← Portable component library (web today, native tomorrow)
│   ├── types/       ← Domain models, DTOs, enums
│   ├── utils/       ← Pure utilities
│   ├── api/         ← Axios + RTK Query + Socket.IO
│   ├── config/      ← env, feature flags, routes, permissions
│   ├── business/    ← Pure business logic (no UI, no I/O)
│   ├── hooks/       ← Cross-platform reusable hooks
│   └── localization/← next-intl bundles & tooling
├── docs/            ← ADRs, diagrams, onboarding, conventions
├── tooling/         ← Shared eslint / prettier / tsconfig / tailwind
└── ARCHITECTURE.md  ← Full architecture document — start here
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router, RSC) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| UI Kit | ShadCN UI |
| State | Redux Toolkit + RTK Query |
| Forms | React Hook Form + Zod |
| HTTP | Axios |
| Realtime | Socket.IO Client |
| Animation | Framer Motion |
| i18n | next-intl |
| Tables | TanStack Table |
| Offline | Workbox + IndexedDB (localforage) |
| Maps | Google Maps + Mapbox (via abstraction) |
| AI | OpenAI integration layer + Voice Assistant |
| PWA | Service Workers + Web Push |

---

## Multi-Role Portals

The single Next.js app hosts three role-isolated portals using App Router route groups:

| Route Group | Audience | Layout |
|-------------|----------|--------|
| `(customer)` | End users | Customer layout — bottom nav on mobile |
| `(provider)` | Service providers / mechanics | Provider layout — request feed + map |
| `(admin)` | Internal admin / support | Admin layout — sidebar, analytics, CMS |
| `(auth)` | Public auth flows | Minimal auth layout |

---

## Read Next

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** — full architecture, philosophy, folder responsibilities, data flow, state, API, scalability, mobile portability, best practices, deployment.
- **[docs/onboarding/](./docs/onboarding/)** — new developer setup guides.
- **[docs/decisions/](./docs/decisions/)** — Architecture Decision Records (ADRs).
- **[docs/conventions/](./docs/conventions/)** — naming, folder, import conventions.

---

## Status

**Step 1 — Auth UI** ✅ Login, register, session persistence, protected routes, Redux + RTK Query

Run the web app:

```bash
pnpm install
pnpm dev
# http://localhost:3001
```

Set `NEXT_PUBLIC_API_BASE_URL` in `apps/web/.env.local` (see `.env.example`).
