# src/layouts — Role-Specific Page Chrome

One folder per role layout. Mounted from `app/(role)/layout.tsx`.

| Folder | Purpose |
|--------|---------|
| `auth-layout/` | Public auth flows — minimal chrome, centered card |
| `customer-layout/` | Customer portal — top header + bottom nav on mobile, sidebar on desktop |
| `provider-layout/` | Provider portal — request feed + persistent map + status bar |
| `admin-layout/` | Admin dashboard — collapsible sidebar + breadcrumbs + multi-pane |
| `marketing-layout/` | Marketing pages (if any) — SEO-optimized header/footer |
| `minimal-layout/` | Used for SOS, voice assistant, kiosk flows |
| `error-layout/` | 4xx / 5xx error pages |

## Layout Composition

```
<RootLayout>             ← from app/layout.tsx
  <AppProviders>
    <RoleLayout>         ← from app/(role)/layout.tsx
      <PageContent>      ← page.tsx
```

A layout owns:

- Top/bottom navigation
- Role-appropriate menu items (derived from `permissions/`)
- Layout-specific subscriptions (e.g., provider layout keeps a persistent socket to incoming requests)
- Breadcrumb derivation
- Notification badges
