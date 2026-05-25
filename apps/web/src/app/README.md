# src/app — Next.js App Router

**Routing layer only.** Pages are thin shells that render containers from `src/modules/*`. No business logic, no direct data fetching beyond hydration.

## Route Groups

| Group | Purpose | Layout |
|-------|---------|--------|
| `(auth)` | Public auth flows (login, register, OTP, forgot/reset password) | `AuthLayout` |
| `(customer)` | End-user portal | `CustomerLayout` |
| `(provider)` | Service-provider portal | `ProviderLayout` |
| `(admin)` | Admin / support / ops dashboard | `AdminLayout` |
| `api/` | Next route handlers — BFF / proxies / webhooks only | n/a |

Route groups give us role-isolated layouts and middleware without affecting URLs.

## File Conventions per route

```
<route>/
├── page.tsx         Server component; renders a module container
├── layout.tsx       Optional nested layout
├── loading.tsx      Suspense fallback
├── error.tsx        Error UI (catches render-time errors)
├── not-found.tsx    Optional 404 boundary
├── metadata.ts      generateMetadata() exports
└── README.md        (only for non-obvious routes)
```

## Middleware

The Edge `middleware.ts` (at `apps/web/src/middleware.ts` or `apps/web/middleware.ts`):

- Validates session cookies (signed/encrypted).
- Resolves the user's role.
- Redirects unauthorized users.
- Attaches `x-user-role`, `x-correlation-id`, `x-locale` headers.

Helpers live in `src/middleware-utils/`.

## What NOT to put here

- ❌ Business logic
- ❌ API calls
- ❌ Redux setup
- ❌ Reusable components
- ❌ Complex hooks

All of the above live in `src/modules/*` or shared layers.
