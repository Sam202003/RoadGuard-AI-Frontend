# @rg/config — Shared Configuration

Typed env, feature flags, theme tokens, routes, permissions, branding, tenant config, and SDK keys.

| Folder | Purpose |
|--------|---------|
| `env/` | Zod-validated env schema. `client.ts` (public), `server.ts` (secret). |
| `feature-flags/` | Flag definitions + runtime resolver. Local → remote (LaunchDarkly/PostHog) → cookie override. |
| `theme/` | Brand-agnostic design tokens (`@rg/ui` consumes these). |
| `routes/` | Canonical route map — `ROUTES.customer.dashboard()`, `ROUTES.provider.requests.detail(id)` |
| `permissions/` | RBAC matrix consumed by web middleware + UI guards + (future) mobile |
| `constants/` | App-wide constants — pagination defaults, timeouts, limits |
| `branding/` | Per-tenant branding profiles (white-label) |
| `tenants/` | Tenant resolver (hostname → tenant config) |
| `sdk-keys/` | Per-env / per-tenant SDK key resolution (Maps, AI, Payments) |

## env schema example

```ts
// schema.ts
export const ClientEnv = z.object({
  NEXT_PUBLIC_API_BASE_URL: z.string().url(),
  NEXT_PUBLIC_SOCKET_URL: z.string().url(),
  NEXT_PUBLIC_GOOGLE_MAPS_KEY: z.string(),
  NEXT_PUBLIC_MAPBOX_TOKEN: z.string().optional(),
  NEXT_PUBLIC_SENTRY_DSN: z.string().optional(),
  NEXT_PUBLIC_POSTHOG_KEY: z.string().optional(),
  NEXT_PUBLIC_AI_ENABLED: z.coerce.boolean().default(true),
  NEXT_PUBLIC_VOICE_ENABLED: z.coerce.boolean().default(true),
});

export const ServerEnv = z.object({
  OPENAI_API_KEY: z.string(),
  STRIPE_SECRET_KEY: z.string(),
  FCM_SERVER_KEY: z.string(),
  // … secrets, never reach the browser
});
```

## Routes are typed builders

```ts
// routes/customer.ts
export const customerRoutes = {
  dashboard: () => '/dashboard',
  vehicles: {
    list: () => '/vehicles',
    detail: (id: VehicleId) => `/vehicles/${id}`,
  },
  breakdown: {
    new: () => '/breakdown/new',
    detail: (id: BreakdownId) => `/breakdown/${id}`,
  },
  tracking: (id: BreakdownId) => `/tracking/${id}`,
} as const;
```

## White-labeling

```ts
// branding/default/index.ts
export const defaultBrand = {
  name: 'Road Guard',
  colors: { primary: { … } },
  logoUrl: '/brand/default/logo.svg',
  supportEmail: 'support@roadguard.app',
  // …
};
```

Tenant resolution happens at the **Edge middleware** (host header) → token injection → theme provider.
