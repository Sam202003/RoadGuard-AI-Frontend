# ADR-0005: Maps Provider Abstraction (Google + Mapbox)

- **Status:** Accepted
- **Date:** 2026-05-12

## Context

Google Maps has the best India coverage but is expensive at scale. Mapbox is cheaper but coverage varies. On mobile we'll likely use `react-native-maps` (Google) and `@rnmapbox/maps`. We **must not** couple feature code to either provider.

## Decision

A `MapAdapter` interface in `apps/web/src/maps/types/` defines a provider-agnostic API. Adapters implement it for Google Maps and Mapbox. Components consume only `<Map>`, `<Marker>`, etc. — never raw SDKs.

The chosen adapter is loaded lazily (only the selected provider's JS is shipped per session) and resolved from env / feature flag / tenant config.

## Consequences

- Provider swap is a deploy, not a refactor.
- Two implementations to maintain (mitigated by tiny adapter surface).
- React Native gets a third adapter; feature code remains unchanged.
