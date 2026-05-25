# State Management Deep Dive

See also: [ADR-0003](../decisions/0003-state-management.md).

## State Taxonomy

| Kind | Tool | Lives in | Persisted? |
|------|------|----------|-----------|
| Server cache | RTK Query | `packages/api/rtk-query` | Optional (whitelist) |
| Real-time state | Redux slice + socket middleware | `apps/web/src/store/slices/realtime` | No |
| Session / Auth | Redux slice + secure cookie | `apps/web/src/modules/auth/store` | Yes (TokenStore) |
| Global UI | Redux slice | `apps/web/src/store/slices/ui` | Yes (theme, locale) |
| Module-feature state | Redux slice (per module) | `modules/<x>/store` | Selective |
| Form state | React Hook Form | Component scope | No |
| Ephemeral UI | `useState` / `useReducer` | Component scope | No |
| Offline queue | IDB + Redux | `apps/web/src/offline/queue` + slice | Yes |
| Feature flags | Context + remote provider | `packages/config/feature-flags` | Cache only |
| AI conversation | Redux slice + IDB | `apps/web/src/modules/ai-assistant/store` | Yes |

## Listener Middleware as the orchestration bus

Side effects (API prefetch, analytics, socket subscriptions, navigations) belong in **listeners**, not in components:

```ts
listenerMiddleware.startListening({
  matcher: isAnyOf(loginThunk.fulfilled, refreshThunk.fulfilled),
  effect: async (action, api) => {
    const role = selectRole(api.getState());
    api.dispatch(api.endpoints.getDashboard.initiate());  // prefetch
    socketClient.connect(action.payload.token);
    analytics.identify(action.payload.user);
    sentry.setUser(action.payload.user);
  }
});
```

## RTK Query Tag Catalogue

```
Vehicle, Breakdown, BreakdownList, Tracking, Wallet, Membership,
Payment, Invoice, Notification, ChatThread, ChatMessage,
ProviderProfile, Review, KycStatus, Earning, AnalyticsBucket,
CmsArticle, FeatureFlag, AdminUser
```

Mutations declare which tags to **invalidate**; queries declare which tags they **provide**. RTK Query auto-refetches.

## Persistence

Persistence is opt-in per slice via `redux-persist` whitelist. Sensitive slices are **never** persisted to localStorage; tokens live in HttpOnly cookies + in-memory.
