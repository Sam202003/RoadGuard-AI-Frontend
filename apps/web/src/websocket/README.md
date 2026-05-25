# src/websocket — Real-Time Layer

Bridges Socket.IO events to Redux state.

| Folder | Purpose |
|--------|---------|
| `handlers/` | One file per event type: `onTrackingUpdate.ts`, `onRequestAssigned.ts`, `onChatMessage.ts`, `onSosBroadcast.ts` |
| `events/` | Constants + payload types (single source of truth between client & backend) |
| `channels/` | Channel definitions: `user:{id}`, `provider:{id}`, `tracking:{requestId}`, `sos:global`, `admin:control` |
| `rooms/` | Room join/leave orchestration (e.g., join `tracking:{id}` when entering tracking page) |
| `reconnect/` | Exponential backoff + jitter strategy |
| `middleware/` | Redux middleware bridging socket events ↔ store |

## Pattern

```
Server emits 'tracking:update'
        ↓
Socket client receives event
        ↓
Middleware dispatches typed action: realtime/trackingUpdated
        ↓
Reducer updates Redux state OR RTK Query updateQueryData
        ↓
Components subscribed via selector re-render
```

## Rules

- Event names live **only** in `events/` constants; no string literals elsewhere.
- Handlers are **pure functions** of `(payload, dispatch) → void` — easy to test.
- High-frequency events (location ticks) are throttled at the middleware boundary.
- All channels validate auth + role before subscribing.
