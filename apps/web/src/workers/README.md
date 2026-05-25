# src/workers — Web Workers & Service Worker

| File / Folder | Purpose |
|---------------|---------|
| `service-worker.ts` | Workbox-based SW: app shell, asset precaching, runtime strategies, push handler |
| `push-handler.ts` | Web Push notification handler |
| `background-sync.ts` | Drains offline queue when connection returns |
| `cpu-workers/` | Web Workers for CPU-intensive tasks (e.g., polyline decoding, image compression) |

## Service Worker scope

- Precaches app shell, fonts, locale bundles.
- Runtime caches API GETs with `StaleWhileRevalidate`.
- Receives push notifications and routes them through `src/notifications`.
- Background-sync drains `src/offline/queue` on connectivity.
- Forces refresh on schema migration (notifies clients via `postMessage`).

## CPU Workers

Heavy work that would jank the UI thread is moved to dedicated workers:

- Polyline decoding for large routes
- Client-side image compression before upload
- AI memory indexing
