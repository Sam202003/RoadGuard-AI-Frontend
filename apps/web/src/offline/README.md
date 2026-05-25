# src/offline — Offline-First Architecture

Stranded users often have flaky networks. The app must always **load**, **accept input**, and **never lose data**.

| Folder | Purpose |
|--------|---------|
| `queue/` | Outbound action queue (IDB-backed). Stores mutations that failed due to no network. |
| `sync/` | Sync engine — on reconnect, drains the queue with conflict-aware retries. |
| `storage/` | IndexedDB schema + migrations (via localforage / Dexie). |
| `strategies/` | Cache strategies: `CacheFirst`, `NetworkFirst`, `StaleWhileRevalidate`, `NetworkOnly`. |
| `resolvers/` | Conflict resolution: `last-write-wins`, `merge`, `prompt-user`. |

## How it works

1. **Mutation issued** while online → goes straight to API.
2. **Mutation issued** while offline → enqueued in IDB → optimistic UI update → marker shown ("Will sync when online").
3. **Connection restored** → sync engine drains queue in order, with idempotency keys.
4. **Conflict detected** → resolver runs; UI prompts the user only when ambiguity remains.

## Companion Subsystems

- `src/caching/` — HTTP-level cache policies (per resource TTL, who owns invalidation).
- `src/workers/` — Service worker (Workbox) for app shell + static asset caching.
- `src/storage/` — IDB schema for entity caches.
