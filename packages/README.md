# packages/ — Shared Libraries

Platform-agnostic libraries consumed by `apps/web` today and by `apps/mobile` tomorrow (React Native). Everything in this folder is **strictly framework- and platform-free** — no `next/*`, no `window`, no `document`, no React Native imports.

| Package | Purpose | Platform-Agnostic? |
|---------|---------|--------------------|
| [`ui`](./ui/) | Portable component library | Yes (via adapters/web vs adapters/native) |
| [`types`](./types/) | Domain types, DTOs, enums | Yes — pure TypeScript |
| [`utils`](./utils/) | Pure utility functions | Yes |
| [`api`](./api/) | HTTP + RTK Query + sockets | Yes — Axios + Socket.IO work on web & native |
| [`config`](./config/) | env, feature flags, routes, permissions, branding | Yes — pure data |
| [`business`](./business/) | Pure business logic, state machines | Yes — zero I/O |
| [`hooks`](./hooks/) | Cross-platform reusable hooks | Yes (React-only, no DOM) |
| [`localization`](./localization/) | Translation bundles + tooling | Yes (swap intl backend per platform) |

## Rules for any package

- ✗ **No** `next/*` imports
- ✗ **No** `window` / `document` / `localStorage` / `IndexedDB`
- ✗ **No** Tailwind classnames in JS files (use design tokens)
- ✗ **No** dependency on `apps/*`
- ✓ All exports must be **type-safe** and **tree-shakeable**
- ✓ Every package has a `src/index.ts` barrel that defines its public API
- ✓ Every package has unit tests
- ✓ Every package has zero runtime dependencies on browser-only APIs

## Package linking

In a `pnpm` workspace, apps import packages by their alias:

```ts
import type { Breakdown } from '@rg/types';
import { calculatePrice } from '@rg/business';
import { useGetBreakdownsQuery } from '@rg/api';
```

Aliases are defined in `tooling/tsconfig/base.json`.

## Adding a new package

1. Create `packages/<name>/src/index.ts` + `package.json`.
2. Add path alias to `tooling/tsconfig/base.json`.
3. Add workspace entry to root `pnpm-workspace.yaml`.
4. Add an ADR in `docs/decisions/` if the package introduces a new concern.
