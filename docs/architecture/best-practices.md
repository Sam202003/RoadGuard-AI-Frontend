# Best Practices Cheat Sheet

## Always

- ✓ Put new business logic in `@rg/business` — not in a component or hook.
- ✓ Put new types in `@rg/types` — never inline.
- ✓ Wrap third-party SDKs in `services/*` adapters with a typed port.
- ✓ Navigate via `ROUTES.<…>` — never hardcode URLs.
- ✓ Validate API responses with Zod in dev (`schemas.ts`).
- ✓ Tag every RTK Query endpoint for cache invalidation.
- ✓ Use listener middleware for side effects (analytics, prefetch, sockets).
- ✓ Localize every user-facing string (`t('…')`).
- ✓ Add Storybook stories + a11y check for new components.
- ✓ Co-locate `*.test.tsx`, `*.stories.tsx`, `*.module.css` with the component.
- ✓ Use branded ID types (`UserId`, `BreakdownId`) to prevent mixing.
- ✓ Throttle high-frequency socket events at the middleware boundary.
- ✓ Use `useCan(action, resource)` for permission gating.

## Never

- ✗ Import another module's internals — only its barrel.
- ✗ Call `axios` / `fetch` / `socket.io-client` directly from a component.
- ✗ Touch `window`, `document`, `navigator`, `localStorage` outside `services/*` or platform-guarded hooks.
- ✗ Read `process.env` directly — use `@rg/config/env`.
- ✗ Put feature code in `app/` — pages are thin shells.
- ✗ Cross-couple apps and packages in the wrong direction (`apps` ← `packages`, never the reverse).
- ✗ Persist tokens or PII to `localStorage` without encryption.
- ✗ Hardcode `'/foo/bar'` URLs in components.
- ✗ Use `as` casts to bypass type errors — fix the type.
- ✗ Write inline socket subscriptions in components — use `useSocketEvent`.
- ✗ Skip RTK Query tagging — uninvalidated caches cause stale-data bugs.

## Component patterns

- Containers (data fetching) wrap presentational components.
- Presentational components receive data via props; never query the store.
- A page in `app/` is at most ~20 lines: layout + metadata + container render.

## Hook patterns

- A module's primary hook (e.g., `useBreakdownFlow`) is the entry point used by its containers; it composes finer hooks.
- Hooks return objects with named fields, never positional tuples (except `[state, setState]` style).
- Hooks that produce side effects accept dependencies for testability.

## Slice patterns

- One slice per concept (`auth`, `breakdown`, `tracking`, …).
- Reducers are pure — side effects go to listeners.
- Selectors are memoized — never inline filters in components.

## Testing patterns

- Unit-test business logic in `@rg/business` exhaustively.
- Integration-test module flows via RTL + MSW.
- E2E-test critical journeys per role with Playwright.
- Visual regression via Storybook + Chromatic.

## Performance patterns

- Lazy-load below-the-fold sections with `next/dynamic`.
- Use `React.memo` only when you have measured a re-render cost.
- Prefer `useMemo` for derived data, `useCallback` only for stable references passed to memoized children.
- Avoid running translation lookups in tight loops — memoize.
