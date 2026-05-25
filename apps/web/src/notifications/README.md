# src/notifications — Notification System

Unified notification system covering in-app, browser push, and inbox.

| Folder | Purpose |
|--------|---------|
| `channels/` | In-app toast / banner / modal / push / email-bridge channels |
| `templates/` | Reusable notification components per type |
| `handlers/` | Route a notification → action (deep-link, open modal, show toast) |
| `inbox/` | Persistent in-app notification center |

## Sources of notifications

| Source | Path |
|--------|------|
| Socket events | `src/websocket/handlers/*` → notification dispatcher |
| Push notifications | Service worker → notification dispatcher |
| API responses (e.g., 409 conflict) | `services/api/interceptors` → toast |
| User actions (e.g., "Saved!") | imperative toast API |

## Central dispatcher

A single `notifyService.dispatch(notification)` API:

1. Looks up user preferences (channel opt-in).
2. Routes to channels in priority order.
3. Persists to inbox.
4. Emits analytics event.
5. Returns a handle for dismiss / mark-read.
