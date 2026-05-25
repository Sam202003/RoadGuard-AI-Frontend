# src/providers — Root Context Providers

Each provider lives in its own folder with an explicit responsibility. They are composed into a single `<AppProviders>` at the root of the app tree.

## Composition Order (top → bottom)

```
<ErrorBoundary>           ← catches everything below
  <ReduxProvider>         ← Redux store must exist before any selector
    <QueryProvider>       ← RTK Query / TanStack Query
      <ThemeProvider>     ← next-themes + design tokens
        <I18nProvider>    ← next-intl
          <FeatureFlagProvider>
            <AuthProvider>
              <PermissionProvider>
                <SocketProvider>
                  <NotificationProvider>
                    <AIProvider>
                      <ModalProvider>
                        <ToastProvider>
                          {children}
```

## Folders

| Folder | Provides |
|--------|----------|
| `redux/` | Redux store provider + persist gate |
| `query/` | RTK Query + TanStack Query providers |
| `theme/` | next-themes + design tokens + tenant branding |
| `i18n/` | next-intl provider + locale resolver |
| `socket/` | Socket.IO connection lifecycle |
| `auth/` | Session, login state, token refresh |
| `permission/` | RBAC + ABAC `useCan` context |
| `notification/` | In-app + push notifications |
| `analytics/` | Pluggable analytics adapter (PostHog/GA/Mixpanel) |
| `error-boundary/` | Top-level error boundary |
| `modal/` | Imperative modal API |
| `toast/` | Imperative toast API |
| `feature-flag/` | Feature flag resolver |
| `ai/` | AI agent context (chat history, voice state) |

## Rules

- Each provider must be **isolated** — never reach into another's internals.
- Providers must be **safe in RSC** (server components) — wrap browser-only logic in `'use client'` boundaries.
- Providers must be **lazy where possible** — e.g., `SocketProvider` connects only after `AuthProvider` resolves a session.
