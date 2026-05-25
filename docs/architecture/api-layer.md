# API Layer Deep Dive

The entire API layer lives in **`@rg/api`** (`packages/api`) so it ships unchanged to React Native.

## Layer Map

```
Component
   ↓ uses
Hook (modules/<x>/hooks)
   ↓ uses
RTK Query auto-generated hook (@rg/api/rtk-query/slices/<resource>)
   ↓ uses
baseQueryWithReauth (@rg/api/rtk-query/base-query)
   ↓ uses
Axios client (@rg/api/client/axios) + interceptors
   ↓ wraps
HTTP transport
```

## Interceptor Chain

```
Outgoing request:
  - tracing.ts        → attach correlation ID
  - auth.ts           → attach Bearer token (via TokenStore port)
  - (optional) signing → for sensitive endpoints

Incoming response:
  - error.ts          → normalize errors → DomainError
  - refresh.ts        → on 401: refresh & retry once
  - retry.ts          → on 5xx + idempotent: exponential backoff
  - tracing.ts        → log correlation ID
```

## Resource folder

```
endpoints/<resource>/
├── types.ts         DTOs
├── schemas.ts       Zod schemas (dev runtime validation)
├── endpoints.ts     RTK Query endpoints
├── adapter.ts       DTO ↔ domain transformers
└── index.ts
```

## Endpoint example structure (no implementation)

```
breakdown.endpoints
├── getBreakdowns        provides ['BreakdownList']
├── getBreakdownById     provides [{ type: 'Breakdown', id }]
├── createBreakdown      invalidates ['BreakdownList']
├── cancelBreakdown      invalidates [{ type: 'Breakdown', id }]
├── uploadPhoto          (multipart, optimistic)
└── subscribeUpdates     (RTK Query streaming for resumable streams)
```

## Sockets

Sockets ship in the same package because they're part of the **API contract**:

```
sockets/
├── client.ts              Socket.IO factory
├── events.ts              Event-name enum (single source of truth)
├── handlers/<event>.ts    Pure handlers
├── channels/<channel>.ts  Join/leave logic
└── middleware.ts          Redux middleware bridge
```

## Error Normalization

All API errors become a `DomainError`:

```ts
type DomainError = {
  code: ErrorCode;            // 'NETWORK' | 'AUTH' | 'VALIDATION' | …
  status?: number;
  message: string;            // user-friendly (localized via t())
  details?: Record<string, unknown>;
  correlationId?: string;
};
```

This single shape is consumed by toasts, error boundaries, Sentry, and analytics.

## Token Store Port

```ts
export interface TokenStore {
  getAccess(): Promise<string | null>;
  getRefresh(): Promise<string | null>;
  set(t: Tokens): Promise<void>;
  clear(): Promise<void>;
}
```

- Web adapter: HttpOnly cookies + in-memory cache.
- Native adapter (future): `expo-secure-store` / Keychain / Keystore.

The API layer never reads storage directly — it goes through the port.
