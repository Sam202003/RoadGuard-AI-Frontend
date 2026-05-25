# @rg/hooks — Cross-Platform Reusable Hooks

React hooks that don't touch the DOM directly and therefore work on both web and React Native.

| Folder | Examples |
|--------|----------|
| `data/` | `useFetch`, `usePaginated`, `useInfinite`, `useAsync` |
| `ui/` | `useDebounce`, `useThrottle`, `useToggle`, `usePrevious` |
| `platform/` | `usePlatform()` (web/native/server), `useUserAgent`, `useIsClient` |
| `network/` | `useOnline`, `useNetworkSpeed`, `useReconnect` |
| `auth/` | `useAuthSession`, `useRoles`, `useIsAuthenticated` |
| `permission/` | `useCan`, `useRoleGuard` |
| `storage/` | `useLocalStorage`, `useIDB`, `useSessionStorage` (platform-adapted) |
| `geolocation/` | `useCurrentLocation`, `useLocationWatch` |
| `form/` | `useTypedForm` (RHF + Zod wrapper) |
| `media/` | `useCamera`, `useMic`, `useMediaPermissions` |
| `clipboard/` | `useClipboard` |
| `animation/` | `useReducedMotion`, `useSpring` |
| `debug/` | `useWhyDidYouRender`, `useTraceUpdate` |
| `intersection/` | `useIntersectionObserver` |
| `realtime/` | `useSocketEvent`, `useChannel` |
| `upload/` | `useFileUpload` |
| `ai/` | `useAIChat`, `useVoice`, `useStreamingResponse` |

## Rules

- ✗ No direct `window` / `document` access. Use the **platform adapter** pattern instead.
- ✗ No imports from `apps/web` — must be platform-agnostic.
- ✓ Every hook has a unit test using React Testing Library.
- ✓ Hooks that need platform-specific behavior accept an injected dependency (e.g., `useCurrentLocation(geolocationAdapter)`).
