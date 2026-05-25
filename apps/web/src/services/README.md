# src/services — Infrastructure Adapters

Side-effect-ful adapters that wrap browser/Node/SDK APIs behind **typed interfaces**. The rest of the app consumes these adapters through hooks; the underlying SDK can be swapped without touching feature code.

| Folder | Wraps | Swappable Implementations |
|--------|-------|---------------------------|
| `api/` | Axios HTTP client | Different base URLs per env / region |
| `sockets/` | Socket.IO client | WebSocket / SSE fallback |
| `maps/` | Google + Mapbox SDKs | Either or both at runtime |
| `ai/` | OpenAI / Anthropic / local LLM | Provider-agnostic interface |
| `voice/` | Web Speech / Whisper / ElevenLabs | STT + TTS adapters |
| `storage/` | localStorage / IndexedDB / localforage | In-memory in tests |
| `notification/` | In-app + browser + email | Channel-agnostic dispatcher |
| `analytics/` | PostHog / GA4 / Mixpanel | Multi-target |
| `upload/` | S3 / GCS / direct upload | Presigned URL strategy |
| `geolocation/` | `navigator.geolocation` | Mock provider for tests |
| `payments/` | Stripe / Razorpay | Region-aware |
| `push/` | Web Push + FCM | Per-platform |
| `encryption/` | Web Crypto API | AES-GCM / RSA wrappers |
| `error-reporting/` | Sentry / Datadog | Multi-target |

## Pattern: Port + Adapter

Every service exposes a **port** (a TypeScript interface):

```ts
export interface MapAdapter {
  render(opts: MapOptions): MapInstance;
  addMarker(m: Marker): MarkerHandle;
  // …
}
```

And one or more **adapters** that implement the port:

```ts
export class GoogleMapsAdapter implements MapAdapter { … }
export class MapboxAdapter implements MapAdapter { … }
```

The chosen adapter is selected at runtime (via env / feature flag / tenant config) and injected through `providers/`.

## Rules

- A service **never** renders UI.
- A service **never** imports from `modules/*`.
- A service is **always** typed at its boundary, even if it wraps an untyped SDK.
- A service has a **test double** (in-memory fake) co-located in `__mocks__/`.
