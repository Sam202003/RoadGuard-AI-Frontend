# src/config — App-Level Config Wiring

App-specific wiring that consumes `@rg/config`. Pure data; no logic.

| File / Folder | Purpose |
|---------------|---------|
| `app.config.ts` | Reads env from `@rg/config/env`, exposes typed `appConfig` |
| `features.config.ts` | Feature flag adapter (env + remote provider) |
| `analytics.config.ts` | Analytics provider selection |
| `maps.config.ts` | Maps provider selection (Google / Mapbox) |
| `ai.config.ts` | AI provider + model selection |
| `payments.config.ts` | Payment provider selection per region |
| `theme.config.ts` | Tenant resolution + token mapping |

## Anti-Pattern

```ts
// ❌ Don't do this anywhere in the app:
const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
```

## Right Pattern

```ts
// ✓ Always go through the typed config:
import { appConfig } from '@/config/app.config';
const apiUrl = appConfig.api.baseUrl;
```
