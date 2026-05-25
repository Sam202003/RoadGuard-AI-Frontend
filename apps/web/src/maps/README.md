# src/maps — Maps Abstraction Layer

Provider-agnostic API for maps. Supports Google Maps and Mapbox today; React Native maps tomorrow — without touching feature code.

| Folder | Purpose |
|--------|---------|
| `adapters/google/` | Google Maps adapter (web) |
| `adapters/mapbox/` | Mapbox adapter (web; parity with mobile) |
| `providers/` | `<MapProvider>` resolves which adapter to use (env / flag / tenant) |
| `services/` | Geocoding, directions, distance-matrix, places — provider-agnostic |
| `hooks/` | `useMap`, `useMarker`, `usePolyline`, `useCurrentLocation`, `useGeofence` |
| `components/` | `<Map>`, `<Marker>`, `<Polyline>`, `<RouteOverlay>`, `<LiveTracker>` |
| `utils/` | bbox, polyline encoding, clustering, projection helpers |
| `types/` | Provider-agnostic types: `LatLng`, `BBox`, `Marker`, `Route` |

## Contract

```ts
export interface MapAdapter {
  render(opts: MapOptions): MapInstance;
  addMarker(m: Marker): MarkerHandle;
  drawRoute(r: Route): RouteHandle;
  setCenter(coord: LatLng, zoom?: number): void;
  on(event: MapEvent, cb: MapEventHandler): Unsubscribe;
}
```

React Native maps (`react-native-maps`, `@rnmapbox/maps`) will implement the same contract — feature code is unchanged.

## Rules

- Components consume `<Map>` & `<Marker>` only — never `google.maps.*` or `mapbox-gl` directly.
- Adapters are loaded **lazily** (`next/dynamic`) — only the chosen provider's bundle ships.
- All API keys come from `packages/config/sdk-keys`, resolved per env/tenant.
