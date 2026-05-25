# modules/tracking — Live Tracking Module

Real-time tracking of an assigned provider en route to the customer.

## Highlights

- Subscribes to `tracking:{breakdownId}` socket channel on mount.
- Receives high-frequency location ticks; client-side smoothing applied before render.
- Map is rendered via `src/maps` (provider-agnostic).
- ETA recomputed locally using `@rg/business/calculators/eta` based on remaining distance + current traffic estimate.
- Lifecycle is driven by the breakdown state machine (`@rg/business/workflows/breakdown`).

## Folder Shape

```
tracking/
├── components/
│   ├── TrackingPage.tsx
│   ├── TrackingMap.tsx                 Wraps <Map> + <RouteOverlay>
│   ├── ProviderInfoCard.tsx
│   ├── ETABanner.tsx
│   ├── ChatLauncherButton.tsx
│   ├── SOSFloatingButton.tsx
│   └── …
├── hooks/
│   ├── useTrackingSession.ts           Subscribes to socket channel
│   ├── useETA.ts
│   └── useLiveLocation.ts              Throttles + smooths ticks
├── services/
├── store/
│   ├── tracking.slice.ts               Active session state
│   ├── tracking.selectors.ts
│   └── tracking.listeners.ts
├── api/                                Tracking RTK Query slice (separate from root API)
└── …
```

## Why a separate tracking API slice

High-frequency updates are isolated from the main API slice so:

- Cache eviction policy can be more aggressive.
- Stale data doesn't bloat the main cache.
- Easy to disable polling fallback when on slow networks.
