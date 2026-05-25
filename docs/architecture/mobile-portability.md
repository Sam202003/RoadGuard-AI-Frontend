# Mobile (React Native) Portability Strategy

See also: [ADR-0004](../decisions/0004-mobile-portability-via-packages.md).

## Goal

When we add `apps/mobile` (Expo / React Native), **we will not rewrite**:

- Business logic
- Domain types
- API endpoints + RTK Query slices
- Socket handlers + events
- Validation schemas
- Redux store
- Most hooks
- Translations
- Design tokens
- Permissions matrix
- Route map (URLs → screen routes is a small mapping)

## What does change

| Concern | Web | Native |
|---------|-----|--------|
| **Render primitives** | `apps/web/src/components` + `packages/ui/adapters/web` | `packages/ui/adapters/native` |
| **Navigation** | Next.js App Router | React Navigation |
| **Storage** | localStorage / IndexedDB | MMKV / expo-secure-store |
| **Geolocation** | `navigator.geolocation` | `expo-location` |
| **Push** | Web Push + FCM | FCM / APNs via `expo-notifications` |
| **Maps** | Google / Mapbox web SDK | `react-native-maps` / `@rnmapbox/maps` |
| **Voice** | Web Speech | `expo-speech` / `expo-av` |
| **Camera** | `getUserMedia` | `expo-camera` |
| **Service Worker** | Workbox | Background fetch + MMKV cache |

## Pattern: Ports & Adapters

Every cross-platform concern is exposed as a **port** (TS interface) in `packages/*` and implemented by a platform-specific **adapter**:

```
packages/api/src/client/auth/token-store.ts        ← port
apps/web/src/services/storage/web-token-store.ts   ← web adapter
apps/mobile/src/services/storage/native-token-store.ts  ← future native adapter
```

Ports we will define:

- `TokenStore`
- `Storage` (KV)
- `Geolocation`
- `PushSubscription`
- `FileUploader`
- `MapAdapter`
- `VoiceAdapter` (STT + TTS)
- `BiometricAdapter`
- `ClipboardAdapter`
- `LinkingAdapter` (deep links)
- `AnalyticsAdapter`
- `ErrorReporter`

The application code consumes the **port**; dependency injection (via Providers) picks the right adapter.

## Migration Playbook

1. **Initialize Expo app**: `pnpm create expo apps/mobile`.
2. **Add workspace packages** to `apps/mobile/package.json`.
3. **Implement native adapters** in `apps/mobile/src/services/*` (start with auth, storage, geolocation, push).
4. **Set up navigation**: replace `app/` routes with React Navigation screens that consume the **same** module containers (where the container only uses `@rg/ui` primitives).
5. **Re-implement `@rg/ui/adapters/native`** for the primitives (Button, Input, Dialog, …). Composed components above primitives work unchanged.
6. **Wire RTK store** identically.
7. **Translations**: same JSON bundles, swap `next-intl` for `react-intl` (or keep next-intl in a non-Next environment if shimmed).
8. **Re-write only what's truly platform-specific** (screen transitions, gesture handlers, native modals).

## Estimating effort

| Activity | Estimated savings vs greenfield |
|----------|--------------------------------|
| Business logic | 100% reused |
| API + state | 100% reused |
| Types + validators | 100% reused |
| Hooks (non-DOM) | ~90% reused |
| UI components | 60–80% reused (composed reused, primitives re-implemented) |
| Navigation | 0% (different paradigm) |
| Platform integrations | 0% (must implement) |

Overall: we expect to **save 60–70%** of greenfield mobile effort — directly because of this architecture.
