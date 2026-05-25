# apps/web — Road Guard Web Application

Next.js 15 App Router application that hosts the Customer, Provider, and Admin portals.

## Top-Level Folders

```
src/
├── app/             Next.js App Router (routes only — no business logic)
├── modules/         Feature-driven domain modules (vertical slices)
├── components/      Cross-module shared UI components
├── layouts/         Role-specific page chrome
├── providers/       React context providers (composed at the root)
├── store/           Redux Toolkit root configuration
├── services/        Infrastructure adapters (API, sockets, storage, …)
├── hooks/           App-wide reusable hooks
├── lib/             Framework-specific glue
├── utils/           Web-only utilities (DOM, Next-specific)
├── config/          App-level config (env wiring, flags)
├── constants/       App-wide constants
├── theme/           Tailwind theme + design tokens
├── styles/          Global CSS, Tailwind base
├── types/           App-wide TS types
├── forms/           Cross-module form schemas
├── validations/     Cross-module Zod schemas
├── permissions/     RBAC matrix and guards
├── routes/          Centralized route constants
├── storage/         IndexedDB schema, persistence
├── caching/         Cache strategies and policies
├── offline/         Offline queue, sync, conflict resolution
├── websocket/       Real-time handlers, channels, rooms
├── notifications/   Notification channels, templates, inbox
├── uploads/         File upload adapters and processors
├── ai/              AI agents, prompts, voice, vision
├── maps/            Maps abstraction layer
├── workers/         Web Workers / Service Worker code
├── i18n/            Locale loaders and namespaces
├── middleware-utils/Helpers for Next middleware.ts (Edge)
├── security/        CSP, sanitizers, CSRF helpers
├── a11y/            Accessibility utilities
├── seo/             Metadata helpers, sitemap, structured data
├── test-utils/      Render helpers, mocks
└── mocks/           MSW handlers
```

## Conventions

- **Pages are thin.** A page imports a container from `modules/*` and renders it.
- **No `axios` / `fetch` / `socket.io-client` in components.** Always go through `services/*` or a `modules/*/services` adapter, invoked via a hook.
- **No direct `process.env` access.** Use `@rg/config/env`.
- **Path aliases** are configured in `tooling/tsconfig`. See `ARCHITECTURE.md` § 20.
- **Every module must expose a single `index.ts` barrel.** Cross-module imports of internals are linted out.

## Where to put new code

| You are adding... | Put it here |
|-------------------|-------------|
| A new page route | `src/app/(role)/<route>/page.tsx` (thin shell) |
| A new feature | `src/modules/<feature>/` |
| A new business rule | `packages/business/src/rules/` |
| A new shared component | `src/components/<category>/` or `packages/ui/` if portable |
| A new API endpoint | `packages/api/src/endpoints/<resource>/` |
| A new domain type | `packages/types/src/<resource>/` |
| A new translation key | `packages/localization/src/locales/<lang>/<ns>.json` |
| A new icon | `packages/ui/src/icons/` |
| A new route constant | `packages/config/src/routes/` |
| A new env var | `packages/config/src/env/schema.ts` |
| A new feature flag | `packages/config/src/feature-flags/` |
