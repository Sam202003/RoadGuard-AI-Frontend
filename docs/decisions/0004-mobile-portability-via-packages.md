# ADR-0004: Mobile Portability via `packages/*`

- **Status:** Accepted
- **Date:** 2026-05-12

## Context

The product roadmap includes React Native apps for customer and provider in 6–12 months. We do **not** want to rewrite business logic, types, API contracts, or state management.

## Decision

All non-DOM, non-Next-specific code lives in `packages/*`. Specifically:

- `@rg/types` — types
- `@rg/utils` — pure utils
- `@rg/business` — domain rules + state machines
- `@rg/api` — HTTP + sockets + RTK Query slices
- `@rg/config` — env, flags, routes, permissions
- `@rg/hooks` — cross-platform hooks
- `@rg/localization` — translations
- `@rg/ui` — components with web + native adapters

Every cross-platform concern is exposed as a **port** (TS interface) in `packages/*` with a web **adapter** in `apps/web/src/services/*`. The future mobile app provides its own adapters.

## Consequences

- `apps/web` becomes thinner — it's mostly route definitions, providers, and services.
- Lint rule prevents `next/*`, `window`, `document` from leaking into `packages/*`.
- A small overhead to first-time setup, repaid many-fold at mobile launch time.
- Adapter pattern adds one layer of indirection — well-documented and standard.
