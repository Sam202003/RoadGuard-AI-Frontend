# Getting Started — New Developer Guide

> This guide assumes the implementation phase has started. The repo currently contains the **architecture scaffold only**.

## 1. Mental Model

Read these three documents, in order, before opening any code:

1. [ARCHITECTURE.md](../../ARCHITECTURE.md) — the full architecture document (you will reference this often).
2. [`apps/web/src/modules/README.md`](../../apps/web/src/modules/README.md) — how features are organized.
3. [`packages/README.md`](../../packages/README.md) — what's shared and why.

## 2. Local Development Setup (planned)

```bash
pnpm install
pnpm dev            # starts apps/web on http://localhost:3000
pnpm test           # runs vitest across all packages + apps
pnpm storybook      # starts Storybook for @rg/ui
pnpm typecheck      # TS check across the workspace
pnpm lint
```

## 3. Where to look when adding a feature

| Goal | Location |
|------|----------|
| New page | `apps/web/src/app/(role)/<route>/page.tsx` — thin shell that renders a module container |
| New feature | `apps/web/src/modules/<feature>/` — follow the standard module shape |
| New shared component | `apps/web/src/components/<category>/` |
| New cross-platform component | `packages/ui/src/components/<category>/` |
| New domain type | `packages/types/src/<resource>/` |
| New API endpoint | `packages/api/src/endpoints/<resource>/` |
| New business rule | `packages/business/src/rules/` |
| New route constant | `packages/config/src/routes/` |
| New translation key | `packages/localization/src/locales/<lang>/<ns>.json` |
| New ADR | `docs/decisions/<NNNN>-<slug>.md` |

## 4. What to read for specific subsystems

- **Real-time / sockets:** [`apps/web/src/websocket/README.md`](../../apps/web/src/websocket/README.md)
- **Maps:** [`apps/web/src/maps/README.md`](../../apps/web/src/maps/README.md)
- **AI:** [`apps/web/src/ai/README.md`](../../apps/web/src/ai/README.md)
- **Offline:** [`apps/web/src/offline/README.md`](../../apps/web/src/offline/README.md)
- **Permissions:** [`apps/web/src/permissions/README.md`](../../apps/web/src/permissions/README.md)
- **State:** [`apps/web/src/store/README.md`](../../apps/web/src/store/README.md) + [ADR-0003](../decisions/0003-state-management.md)

## 5. Conventions to internalize

- [Naming](../conventions/naming.md)
- [Imports](../conventions/imports.md)
- [Folders](../conventions/folders.md)

## 6. Definition of Done (checklist)

Before opening a PR, make sure:

- [ ] Code compiles with strict TS (no `any`, no `as` casts crossing packages).
- [ ] Unit tests added/updated (Vitest).
- [ ] Component has Storybook story (if new UI component).
- [ ] User-facing strings localized.
- [ ] Accessibility checked (Storybook a11y addon green).
- [ ] No `process.env` access — use `@rg/config/env`.
- [ ] No direct `axios` / `fetch` / `socket.io` calls in components.
- [ ] No cross-module imports of internals — only barrels.
- [ ] ADR written if the change introduces a new pattern.
