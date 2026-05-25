# src/storage — Client-Side Persistence

IndexedDB schema, migrations, and persistence helpers (backed by `localforage` / `Dexie`).

## What goes here

- IDB **schema** definitions (stores, indexes, version migrations).
- High-level **repositories** per entity (`vehiclesRepo`, `chatRepo`).
- Encryption wrappers for sensitive data (consumes `services/encryption`).

## What does NOT go here

- localStorage / sessionStorage helpers → `@rg/hooks/storage`.
- Token storage → `@rg/api/client/auth` (web impl in `services/storage`).
- Cache strategies → `src/caching`.
- Offline queue → `src/offline/queue`.

## Schema versioning

Every schema change ships a migration:

```ts
db.version(2).stores({ vehicles: '++id, plate, ownerId' }).upgrade(tx => { … });
```

The service worker forces a refresh after a breaking migration.
