# @rg/api — API + RTK Query + Sockets

The complete API layer. Lives in `packages/` (not `apps/web`) so it ships unchanged to React Native.

## Layout

```
src/
├── client/
│   ├── axios/                createAxiosClient({ baseURL, getToken, … })
│   ├── fetch/                Fetch wrapper for RSC/SSR/Edge
│   ├── interceptors/
│   │   ├── auth.ts           Attach Bearer
│   │   ├── refresh.ts        Silent refresh + request queue
│   │   ├── retry.ts          Exponential backoff (idempotent only)
│   │   ├── error.ts          Normalize errors → DomainError
│   │   └── tracing.ts        Correlation-ID propagation
│   ├── auth/                 TokenStore interface (web vs native impl)
│   ├── retry/                Retry policies
│   └── error-handling/       Error code mapping
├── endpoints/                ONE folder per resource
│   └── <resource>/
│       ├── types.ts          Request/response DTOs
│       ├── schemas.ts        Zod schemas (runtime validation)
│       ├── endpoints.ts      RTK Query endpoint definitions
│       └── adapter.ts        DTO ↔ domain model transformers
├── rtk-query/
│   ├── slices/               createApi slices per resource group
│   ├── base-query/           baseQueryWithReauth
│   ├── tags/                 Cache invalidation tags ('Vehicle', 'Breakdown', …)
│   └── transformers/         Response normalizers (e.g., paginated → list+meta)
├── sockets/
│   ├── client.ts             Socket.IO factory
│   ├── handlers/             Typed event handlers
│   ├── events.ts             Event-name enum
│   ├── channels/             Logical channels (tracking, chat, sos, admin)
│   └── middleware.ts         Redux ↔ socket bridge
├── mocks/                    MSW handlers + fixtures (dev + tests + Storybook)
├── graphql/                  (Future) GraphQL operations
└── schemas/                  Top-level shared Zod schemas
```

## Endpoint folder convention

For every resource (e.g., `breakdown`):

```
endpoints/breakdown/
├── types.ts        BreakdownDTO, CreateBreakdownDTO, UpdateBreakdownDTO
├── schemas.ts      Zod schemas mirroring types
├── endpoints.ts    createApi({ endpoints: { … } })
├── adapter.ts      toDomain(dto): Breakdown   |   fromDomain(d): CreateBreakdownDTO
└── index.ts        Public barrel
```

UI consumes endpoints via auto-generated hooks:

```ts
const { data } = useGetBreakdownsQuery();
const [create] = useCreateBreakdownMutation();
```

## baseQueryWithReauth

A single `baseQuery` handles:

1. Attaching the access token
2. On `401` → call refresh endpoint, retry original request
3. On `403` → emit `auth/forbidden` event
4. On `5xx` → bubble up for retry policy
5. Normalize all errors to `DomainError`

## Tag-based cache invalidation

Tags are declared in `rtk-query/tags.ts`:

```ts
export const tags = ['Vehicle','Breakdown','Tracking','Wallet','Membership',…];
```

Mutations invalidate tags; queries provide tags — RTK Query auto-refetches.

## Sockets

Same package owns Socket.IO because the **API surface** (HTTP + WS) is one cohesive contract between client and backend. See `apps/web/src/websocket/` for the *consumer-side* wiring (handlers + Redux middleware).
