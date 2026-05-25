# apps/ — Runnable Applications

| App | Purpose | Status |
|-----|---------|--------|
| `web` | Next.js 15 — Customer + Provider + Admin portals | Current |
| `mobile` | (Future) Expo / React Native — Customer + Provider apps | Planned |
| `admin-desktop` | (Future) Electron-wrapped admin tools | Optional |

Each app is **thin**: it owns routes, providers, and platform-specific service adapters. Business logic, types, API, and state come from `packages/*`.
