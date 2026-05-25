# ADR-0001: Monorepo with `apps/` + `packages/`

- **Status:** Accepted
- **Date:** 2026-05-12

## Context

Road Guard launches as a web app but **must** be ported to React Native in the future. We also expect multiple frontends over time: customer mobile, provider mobile, admin desktop (Electron), partner whitelabels.

## Decision

Adopt a `pnpm` workspace monorepo with two top-level workspaces:

- `apps/*` — runnable applications (today: `web` only)
- `packages/*` — platform-agnostic libraries shared across apps

`turborepo` will be added for caching and task orchestration.

## Consequences

- Adding a new app is additive — no rewrites.
- Shared logic has **one** owner (`packages/*`) and **one** test suite.
- CI complexity rises slightly; mitigated by Turborepo remote cache.
- Strict ESLint rules prevent `apps/web` code from leaking into `packages/*`.
