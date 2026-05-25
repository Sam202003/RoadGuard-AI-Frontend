# ADR-0006: Offline-First Architecture

- **Status:** Accepted
- **Date:** 2026-05-12

## Context

Our core user is a stranded driver. They often have weak or no network. The app **must** load, **must** accept input, and **must not** lose data.

## Decision

- **Workbox service worker** caches the app shell, fonts, locales, marketing pages.
- **RTK Query cache** + **IDB persistence** (via `localforage`) for API data.
- **Offline queue** (`src/offline/queue`) for outbound mutations, drained on reconnect.
- **Conflict resolvers** (`src/offline/resolvers`) handle merge / overwrite / prompt scenarios.
- **Background sync** via service worker when supported.
- **Optimistic UI updates** on all common mutations.

## Consequences

- Bundle includes Workbox + IDB libs; mitigated by tree-shaking and code-splitting.
- Conflict resolution needs care per-resource — documented in each module.
- Excellent UX in low-connectivity scenarios — directly aligned with product value.
