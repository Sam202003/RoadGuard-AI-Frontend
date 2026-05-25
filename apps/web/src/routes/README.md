# src/routes — Route Constants & Builders

Single source of truth for navigation paths. **Never** hardcode `'/dashboard'` in a component — import from here.

## Pattern

```ts
// routes/index.ts
import { customerRoutes } from '@rg/config/routes/customer';
import { providerRoutes } from '@rg/config/routes/provider';
import { adminRoutes } from '@rg/config/routes/admin';
import { authRoutes } from '@rg/config/routes/auth';

export const ROUTES = {
  auth: authRoutes,
  customer: customerRoutes,
  provider: providerRoutes,
  admin: adminRoutes,
} as const;
```

The actual route definitions live in `@rg/config/routes/*` so they're shared with React Native navigation later.

## Usage

```tsx
import { ROUTES } from '@/routes';
import { Link } from 'next/link';

<Link href={ROUTES.customer.tracking(breakdownId)}>View tracking</Link>
```

## Benefits

- Refactor URL once, everywhere updates.
- TypeScript-enforced dynamic segment types.
- Easy migration to React Navigation (just swap the URL builder for a route-object builder).
- Sitemap and breadcrumbs derive from the same tree.
