# src/store — Redux Toolkit Root

Root Redux Toolkit configuration. Per-module slices live inside each module and are registered here.

## Folders

| Folder | Purpose |
|--------|---------|
| `slices/` | Cross-cutting slices that don't belong to any one module (UI, session, network, realtime) |
| `middleware/` | Custom middleware (sockets, offline queue, analytics, logger) |
| `listeners/` | `createListenerMiddleware` listeners for side effects |
| `selectors/` | Cross-module memoized selectors |
| `rtk-query/` | Root API configuration; per-resource slices come from `packages/api` |
| `enhancers/` | Persist gate, devtools, logger enhancers |

## Root Store Shape

```ts
RootState = {
  // Cross-cutting
  ui: UISlice,
  session: SessionSlice,
  network: NetworkSlice,
  notifications: NotificationsSlice,
  realtime: RealtimeSlice,

  // RTK Query
  api: ApiSlice,
  trackingApi: TrackingApiSlice,
  aiApi: AIApiSlice,

  // Per-module slices (registered via barrel imports)
  auth: AuthSlice,
  breakdown: BreakdownSlice,
  vehicles: VehiclesSlice,
  tracking: TrackingSlice,
  chat: ChatSlice,
  wallet: WalletSlice,
  // …
}
```

## Conventions

- Slices are **named after their feature** in singular form: `breakdown`, `wallet`, `chat`.
- Selectors always go through `createSelector` for memoization.
- Listeners are preferred over thunks for orchestration; thunks are reserved for async chains that return values.
- Persistence is opt-in per slice via `redux-persist` whitelist; sensitive slices are **never** persisted.
- Socket events dispatch typed actions via `websocket/middleware`.
