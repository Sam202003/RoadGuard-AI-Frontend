# src/caching — Cache Strategies & Policies

How and where each kind of data is cached.

| Folder | Purpose |
|--------|---------|
| `strategies/` | `CacheFirst`, `NetworkFirst`, `StaleWhileRevalidate`, `NetworkOnly`, `CacheOnly` |
| `policies/` | Per-resource TTL & invalidation rules |
| `layers/` | Cache layer stack: in-memory (RTK Query) → IDB (persistent) → Network |

## Layered cache

```
Component asks for data
   ↓
RTK Query cache hit? → return immediately, optionally revalidate
   ↓
IDB cache hit? → hydrate RTK Query, return, revalidate
   ↓
Network → response → seed both caches
```

## Policy example

```ts
// policies/vehicle.ts
export const vehiclePolicy = {
  ttl: 5 * 60_000,         // 5 minutes
  strategy: 'StaleWhileRevalidate',
  persistToIDB: true,
  invalidatesOn: ['Vehicle'],
};
```
