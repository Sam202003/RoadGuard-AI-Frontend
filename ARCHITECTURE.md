# Road Guard — Enterprise Frontend Architecture

> AI-powered roadside assistance & vehicle breakdown platform.
> Built **web-first** with Next.js 15, designed to be **mobile-portable** to React Native without rewriting business logic, types, APIs, or state.

---

## Table of Contents

1. [Architecture Philosophy](#1-architecture-philosophy)
2. [High-Level Topology](#2-high-level-topology)
3. [Complete Folder Tree](#3-complete-folder-tree)
4. [Folder-by-Folder Responsibilities](#4-folder-by-folder-responsibilities)
5. [Data Flow Architecture](#5-data-flow-architecture)
6. [State Management Architecture](#6-state-management-architecture)
7. [API Layer Architecture](#7-api-layer-architecture)
8. [Real-time / Socket Architecture](#8-real-time--socket-architecture)
9. [Maps Abstraction Layer](#9-maps-abstraction-layer)
10. [AI / Voice Assistant Architecture](#10-ai--voice-assistant-architecture)
11. [Offline-First & Caching Strategy](#11-offline-first--caching-strategy)
12. [Notification & Push Architecture](#12-notification--push-architecture)
13. [Auth, Permissions & Role-Based Layouts](#13-auth-permissions--role-based-layouts)
14. [Routing, Lazy Loading & Code Splitting](#14-routing-lazy-loading--code-splitting)
15. [Internationalization Architecture](#15-internationalization-architecture)
16. [Theming & White-Labeling](#16-theming--white-labeling)
17. [Scalability Strategy](#17-scalability-strategy)
18. [Future Mobile (React Native) Portability](#18-future-mobile-react-native-portability)
19. [Microfrontend Readiness](#19-microfrontend-readiness)
20. [Naming, Folder, and Import Conventions](#20-naming-folder-and-import-conventions)
21. [Environment & Configuration Management](#21-environment--configuration-management)
22. [Testing Strategy](#22-testing-strategy)
23. [Security & Compliance](#23-security--compliance)
24. [Observability, Logging & Analytics](#24-observability-logging--analytics)
25. [Deployment-Ready Considerations](#25-deployment-ready-considerations)
26. [Best Practices Summary](#26-best-practices-summary)

---

## 1. Architecture Philosophy

Road Guard's frontend is engineered around **seven core principles**:

| # | Principle | What it Means |
|---|-----------|---------------|
| 1 | **Feature-Driven Modularity** | Every business capability (auth, breakdown, tracking, wallet, AI, etc.) lives in a self-contained `module` with its own components, hooks, services, store, forms, validations, types, utils and constants. |
| 2 | **Separation of Concerns (4-Layer Model)** | The codebase is strictly split into four horizontal layers: **Presentation → Application (hooks/state) → Domain (business) → Infrastructure (API/sockets/storage)**. Each layer only talks to the one immediately below it. |
| 3 | **Platform-Agnostic Core** | All business logic, types, validations, API contracts, hooks, and state slices live in `packages/*` — completely free of `next/*`, `window`, `document`, or DOM APIs. This is what makes React Native migration trivial. |
| 4 | **Portable UI through Adapters** | UI components are split into **primitives** (low-level, theme-driven, swappable per platform) and **composed components** (built from primitives). On React Native, only the primitives are re-implemented; everything above is reused. |
| 5 | **Single Source of Truth** | Types, constants, env, feature-flags, theme tokens, routes, and permissions live in shared packages — never duplicated. |
| 6 | **Offline-First & Resilient** | IndexedDB/localforage cache + RTK Query + service workers + offline queue ensure the app works even when the user has no network — critical for stranded-driver scenarios. |
| 7 | **Multi-Tenant & Multi-Role by Design** | Customer, Provider, and Admin portals are isolated route groups with their own layouts, guards, permissions, and module subtrees, all hosted in a single Next.js app for shared infrastructure. |

### Mental Model

```
┌──────────────────────────────────────────────────────────────┐
│                     apps/web  (Next.js 15)                   │
│                                                              │
│   ┌─────────────── PRESENTATION LAYER ───────────────┐       │
│   │  app/  layouts/  components/  modules/*/components│       │
│   └────────────────────────┬─────────────────────────┘       │
│                            │                                  │
│   ┌────────────── APPLICATION LAYER ─────────────────┐       │
│   │  modules/*/hooks   modules/*/store               │       │
│   │  providers/  store/  hooks/                      │       │
│   └────────────────────────┬─────────────────────────┘       │
└────────────────────────────│─────────────────────────────────┘
                             │
┌────────────────────────────▼─────────────────────────────────┐
│                       packages/*                              │
│                                                               │
│   ┌─────────────── DOMAIN LAYER ─────────────────┐           │
│   │  business/  types/  config/                   │           │
│   │  (pure, framework-free, platform-free)        │           │
│   └────────────────────┬─────────────────────────┘           │
│                        │                                      │
│   ┌──────────── INFRASTRUCTURE LAYER ───────────┐            │
│   │  api/  hooks/  utils/  localization/  ui/   │            │
│   └─────────────────────────────────────────────┘            │
└───────────────────────────────────────────────────────────────┘
```

---

## 2. High-Level Topology

Road Guard is a **monorepo** (turborepo / pnpm workspaces ready) with two top-level workspaces:

```
RoadGuard-AI-Frontend/
├── apps/
│   └── web/              ← Next.js 15 App Router (the only app today)
└── packages/             ← Shared, platform-agnostic libraries
    ├── ui/               ← Portable component library (web + future native)
    ├── types/            ← All TypeScript domain models / DTOs / enums
    ├── utils/            ← Pure utilities (date, geo, currency, …)
    ├── api/              ← Axios + RTK Query + sockets + endpoints
    ├── config/           ← env, feature flags, routes, permissions, theme
    ├── business/         ← Pure business rules, calculators, workflows
    ├── hooks/            ← Reusable cross-platform hooks (data, ui, network)
    └── localization/     ← next-intl resources, namespaces, formatters
```

**Why a monorepo?** Tomorrow, when we add `apps/mobile` (Expo / React Native) or `apps/admin-desktop` (Electron), they consume the **same** `packages/*`. Zero rewriting.

---

## 3. Complete Folder Tree

```
RoadGuard-AI-Frontend/
│
├── apps/
│   └── web/                                  # Next.js 15 application
│       │
│       ├── public/                           # Static assets served as-is
│       │   ├── icons/                        # Favicons, app icons, PWA icons
│       │   ├── images/                       # Static marketing/UI images
│       │   ├── fonts/                        # Self-hosted fonts
│       │   ├── locales/                      # JSON i18n bundles (en/hi/mr/es)
│       │   └── service-worker/               # Workbox / custom SW assets
│       │
│       └── src/
│           │
│           ├── app/                          # Next.js App Router (route layer ONLY)
│           │   ├── (auth)/                   # Public auth flows
│           │   │   ├── login/
│           │   │   ├── register/
│           │   │   ├── verify-otp/
│           │   │   ├── forgot-password/
│           │   │   └── reset-password/
│           │   │
│           │   ├── (customer)/               # Customer portal route group
│           │   │   ├── dashboard/
│           │   │   ├── vehicles/
│           │   │   ├── breakdown/
│           │   │   │   ├── new/
│           │   │   │   └── [id]/
│           │   │   ├── tracking/[id]/
│           │   │   ├── ai-assistant/
│           │   │   ├── voice-assistant/
│           │   │   ├── memberships/
│           │   │   ├── wallet/
│           │   │   ├── payments/
│           │   │   ├── notifications/
│           │   │   ├── sos/
│           │   │   ├── chat/[id]/
│           │   │   ├── history/
│           │   │   ├── profile/
│           │   │   └── settings/
│           │   │
│           │   ├── (provider)/               # Service Provider portal route group
│           │   │   ├── dashboard/
│           │   │   ├── requests/
│           │   │   ├── navigation/[id]/
│           │   │   ├── earnings/
│           │   │   ├── availability/
│           │   │   ├── history/
│           │   │   ├── reviews/
│           │   │   └── kyc/
│           │   │
│           │   ├── (admin)/                  # Admin dashboard route group
│           │   │   ├── dashboard/
│           │   │   ├── users/
│           │   │   ├── providers/
│           │   │   ├── requests/
│           │   │   ├── payments/
│           │   │   ├── memberships/
│           │   │   ├── analytics/
│           │   │   ├── complaints/
│           │   │   ├── emergency/
│           │   │   ├── cms/
│           │   │   ├── notifications/
│           │   │   ├── ai-monitoring/
│           │   │   └── settings/
│           │   │
│           │   └── api/                      # Next.js route handlers
│           │                                 # (BFF / proxy / webhooks only)
│           │
│           ├── modules/                      # Feature-driven domain modules
│           │   │                             # Each module is fully self-contained
│           │   │
│           │   ├── auth/
│           │   │   ├── components/           # AuthForm, OTPInput, …
│           │   │   ├── hooks/                # useLogin, useSession, useOtp
│           │   │   ├── services/             # api calls / RTK Query thunks
│           │   │   ├── store/                # auth slice + selectors
│           │   │   ├── forms/                # React Hook Form definitions
│           │   │   ├── validations/          # Zod schemas
│           │   │   ├── types/                # Module-local types
│           │   │   ├── utils/                # Auth helpers
│           │   │   ├── constants/            # Storage keys, error codes
│           │   │   ├── api/                  # Module API adapter
│           │   │   └── selectors/            # Memoized selectors
│           │   │
│           │   ├── home/
│           │   ├── dashboard/
│           │   ├── vehicles/
│           │   ├── breakdown/
│           │   ├── tracking/
│           │   ├── ai-assistant/
│           │   ├── voice-assistant/
│           │   ├── memberships/
│           │   ├── wallet/
│           │   ├── payments/
│           │   ├── notifications/
│           │   ├── sos/
│           │   ├── chat/
│           │   ├── service-history/
│           │   ├── profile/
│           │   ├── settings/
│           │   │
│           │   ├── provider/                 # Provider sub-modules
│           │   │   ├── dashboard/
│           │   │   ├── requests/
│           │   │   ├── navigation/
│           │   │   ├── earnings/
│           │   │   ├── availability/
│           │   │   ├── service-history/
│           │   │   ├── reviews/
│           │   │   └── kyc/
│           │   │
│           │   └── admin/                    # Admin sub-modules
│           │       ├── dashboard/
│           │       ├── users/
│           │       ├── providers/
│           │       ├── requests/
│           │       ├── payments/
│           │       ├── memberships/
│           │       ├── analytics/
│           │       ├── complaints/
│           │       ├── emergency/
│           │       ├── cms/
│           │       ├── notifications/
│           │       ├── ai-monitoring/
│           │       └── settings/
│           │
│           ├── components/                   # Cross-module shared components
│           │   ├── primitives/               # Re-exports from packages/ui (ShadCN)
│           │   ├── shared/                   # Generic composed pieces
│           │   ├── layouts/                  # Header, Sidebar, Footer, …
│           │   ├── navigation/               # Tabs, Breadcrumbs, …
│           │   ├── forms/                    # Generic form wrappers
│           │   ├── data-display/             # Tables, Cards, Lists, …
│           │   ├── feedback/                 # Toasts, Alerts, Skeletons
│           │   ├── overlays/                 # Modals, Drawers, Sheets
│           │   ├── maps/                     # Map UI widgets (platform-agnostic)
│           │   ├── ai/                       # Chat bubble, voice button, …
│           │   ├── charts/                   # Analytics charts
│           │   ├── uploader/                 # Drag-drop file UI
│           │   ├── empty-states/
│           │   ├── loaders/
│           │   ├── banners/
│           │   └── badges/
│           │
│           ├── layouts/                      # Page-level chrome per role
│           │   ├── auth-layout/
│           │   ├── customer-layout/
│           │   ├── provider-layout/
│           │   ├── admin-layout/
│           │   ├── marketing-layout/
│           │   ├── minimal-layout/
│           │   └── error-layout/
│           │
│           ├── providers/                    # React context providers (root tree)
│           │   ├── redux/                    # <Provider store={}>
│           │   ├── query/                    # RTK Query / TanStack Query
│           │   ├── theme/                    # next-themes + design tokens
│           │   ├── i18n/                     # next-intl provider
│           │   ├── socket/                   # Socket.IO context
│           │   ├── auth/                     # Auth/session context
│           │   ├── permission/               # RBAC/ABAC context
│           │   ├── notification/             # In-app + push
│           │   ├── analytics/                # PostHog / GA / Mixpanel
│           │   ├── error-boundary/
│           │   ├── modal/
│           │   ├── toast/
│           │   ├── feature-flag/
│           │   └── ai/                       # Voice/chat agent context
│           │
│           ├── store/                        # Redux Toolkit root configuration
│           │   ├── slices/                   # Cross-module slices (UI, session)
│           │   ├── middleware/               # Custom middleware
│           │   ├── listeners/                # createListenerMiddleware
│           │   ├── selectors/                # Cross-module selectors
│           │   ├── rtk-query/                # Root api & cache config
│           │   └── enhancers/                # Persist, devtools, logger
│           │
│           ├── services/                     # Side-effect-ful infra adapters
│           │   ├── api/                      # Axios instance, interceptors
│           │   ├── sockets/                  # Socket.IO bootstrap
│           │   ├── maps/                     # Google + Mapbox adapters
│           │   ├── ai/                       # OpenAI/LLM client
│           │   ├── voice/                    # Web Speech + TTS
│           │   ├── storage/                  # localStorage/IDB/localforage
│           │   ├── notification/             # Push / in-app
│           │   ├── analytics/                # Telemetry
│           │   ├── upload/                   # S3 / presigned URLs
│           │   ├── geolocation/              # navigator.geolocation
│           │   ├── payments/                 # Stripe/Razorpay SDK adapter
│           │   ├── push/                     # FCM / Web Push
│           │   ├── encryption/               # Web Crypto API
│           │   └── error-reporting/          # Sentry / Datadog
│           │
│           ├── hooks/                        # App-wide reusable hooks
│           ├── lib/                          # Framework-specific glue
│           ├── utils/                        # App-wide utilities (web-only)
│           ├── config/                       # App-level config (env, flags)
│           ├── constants/                    # App-wide constants
│           ├── theme/                        # Tailwind theme + tokens
│           ├── styles/                       # Global CSS, Tailwind base
│           ├── types/                        # App-wide TS types
│           ├── forms/                        # Cross-module form schemas
│           ├── validations/                  # Cross-module Zod schemas
│           ├── permissions/                  # RBAC matrix, guards
│           ├── routes/                       # Centralized route constants
│           ├── storage/                      # IDB schema, persistence
│           ├── caching/                      # Cache strategies & policies
│           ├── offline/                      # Offline queue, sync, resolvers
│           ├── websocket/                    # WS handlers, channels, rooms
│           ├── notifications/                # Channels, templates, inbox
│           ├── uploads/                      # Upload adapters & processors
│           ├── ai/                           # AI agents, prompts, tools
│           ├── maps/                         # Map abstraction layer
│           ├── workers/                      # Web Workers / Service Worker
│           ├── i18n/                         # Locale loaders & namespaces
│           ├── middleware-utils/             # Helpers for Next middleware.ts
│           ├── security/                     # CSP, sanitizers, CSRF helpers
│           ├── a11y/                         # Accessibility utilities
│           ├── seo/                          # Metadata helpers, sitemap
│           ├── test-utils/                   # Render helpers, mocks
│           └── mocks/                        # MSW handlers
│
├── packages/                                 # Shared, framework-/platform-agnostic
│   │
│   ├── ui/                                   # Portable component library
│   │   └── src/
│   │       ├── primitives/                   # Base ShadCN primitives
│   │       ├── components/                   # Composed UI
│   │       │   ├── forms/
│   │       │   ├── navigation/
│   │       │   ├── feedback/
│   │       │   ├── overlays/
│   │       │   ├── data-display/
│   │       │   ├── layout/
│   │       │   ├── maps/
│   │       │   ├── ai/
│   │       │   └── charts/
│   │       ├── icons/                        # Iconography
│   │       ├── theme/                        # Design tokens
│   │       ├── tokens/                       # Spacing, color, radius, type
│   │       ├── adapters/                     # Per-platform render adapters
│   │       │   ├── web/                      # Tailwind/CSS adapter
│   │       │   └── native/                   # (future) RN StyleSheet adapter
│   │       ├── hooks/
│   │       ├── utils/
│   │       └── types/
│   │
│   ├── types/                                # Domain models / DTOs / enums
│   │   └── src/
│   │       ├── auth/  user/  provider/  admin/
│   │       ├── vehicle/  breakdown/  request/  tracking/
│   │       ├── membership/  payment/  wallet/
│   │       ├── notification/  chat/  ai/  maps/
│   │       ├── kyc/  review/  analytics/  cms/
│   │       ├── api/  websocket/  dtos/  enums/
│   │       └── shared/
│   │
│   ├── utils/                                # Pure utility functions
│   │   └── src/
│   │       ├── date/  string/  number/  currency/
│   │       ├── distance/  geo/  formatting/  validation/
│   │       ├── crypto/  platform/  logger/  array/
│   │       ├── object/  error/  promise/  functional/
│   │       ├── parsing/  regex/  constants/
│   │
│   ├── api/                                  # API + RTK Query + sockets
│   │   └── src/
│   │       ├── client/
│   │       │   ├── axios/                    # Axios instance factory
│   │       │   ├── fetch/                    # Fetch fallback (RSC/SSR)
│   │       │   ├── interceptors/             # Auth, refresh, retry, error
│   │       │   ├── auth/                     # Token store abstraction
│   │       │   ├── retry/                    # Retry policies
│   │       │   └── error-handling/           # Normalized error mapper
│   │       ├── endpoints/                    # One folder per resource
│   │       │   ├── auth/  users/  providers/  vehicles/
│   │       │   ├── breakdown/  tracking/  memberships/
│   │       │   ├── wallet/  payments/  notifications/
│   │       │   ├── chat/  ai/  admin/  cms/
│   │       │   ├── reviews/  kyc/  analytics/
│   │       ├── rtk-query/
│   │       │   ├── slices/                   # createApi slices per resource
│   │       │   ├── base-query/               # Shared baseQuery + reauth
│   │       │   ├── tags/                     # Cache invalidation tags
│   │       │   └── transformers/             # Response normalizers
│   │       ├── sockets/
│   │       │   ├── handlers/                 # onTrackingUpdate, onChat, …
│   │       │   ├── events/                   # Event name constants
│   │       │   ├── channels/                 # Room/channel definitions
│   │       │   └── middleware/               # Redux ↔ socket bridge
│   │       ├── mocks/                        # MSW fixtures & handlers
│   │       ├── graphql/                      # (future) GraphQL ops
│   │       └── schemas/                      # Zod request/response schemas
│   │
│   ├── config/                               # Shared config
│   │   └── src/
│   │       ├── env/                          # Typed env access
│   │       ├── feature-flags/                # Flag definitions + provider
│   │       ├── theme/                        # Brand-agnostic tokens
│   │       ├── routes/                       # Canonical route map
│   │       ├── permissions/                  # RBAC matrix
│   │       ├── constants/
│   │       ├── branding/                     # White-label tenants
│   │       ├── tenants/                      # Per-tenant config
│   │       └── sdk-keys/                     # Maps/AI key resolution
│   │
│   ├── business/                             # Pure business logic
│   │   └── src/
│   │       ├── rules/                        # Domain rules (eligibility, …)
│   │       ├── calculators/
│   │       │   ├── pricing/                  # Service price calculator
│   │       │   ├── distance/                 # Haversine / road distance
│   │       │   ├── eta/                      # ETA computations
│   │       │   ├── billing/                  # Invoice math
│   │       │   └── tax/                      # GST/tax computations
│   │       ├── validators/                   # Pure validators (no Zod dep)
│   │       ├── workflows/                    # Orchestrators (state machines)
│   │       │   ├── breakdown/                # Request → Assigned → Done
│   │       │   ├── tracking/
│   │       │   ├── payment/
│   │       │   ├── membership/
│   │       │   ├── kyc/
│   │       │   └── sos/
│   │       ├── policies/                     # Access/authorization policies
│   │       ├── state-machines/               # XState definitions
│   │       ├── domain/                       # Domain primitives (Money, Geo)
│   │       └── errors/                       # Domain error classes
│   │
│   ├── hooks/                                # Cross-platform reusable hooks
│   │   └── src/
│   │       ├── data/                         # useFetch, usePaginated, …
│   │       ├── ui/                           # useDebounce, useMediaQuery
│   │       ├── platform/                     # usePlatform, useUserAgent
│   │       ├── network/                      # useOnline, useNetworkSpeed
│   │       ├── auth/                         # useAuthSession, useRoles
│   │       ├── permission/                   # useCan, useRoleGuard
│   │       ├── storage/                      # useLocalStorage, useIDB
│   │       ├── geolocation/                  # useCurrentLocation
│   │       ├── form/                         # useTypedForm
│   │       ├── media/                        # useCamera, useMic
│   │       ├── clipboard/
│   │       ├── animation/
│   │       ├── debug/
│   │       ├── intersection/
│   │       ├── realtime/                     # useSocketEvent
│   │       ├── upload/                       # useFileUpload
│   │       └── ai/                           # useAIChat, useVoice
│   │
│   └── localization/                         # next-intl bundles + tooling
│       └── src/
│           ├── locales/{en,hi,mr,es,ar,fr}/
│           ├── namespaces/                   # auth.json, breakdown.json, …
│           ├── formatters/                   # Currency/date formatters
│           ├── providers/
│           ├── utils/
│           └── types/
│
├── docs/                                     # Architecture & decision docs
│   ├── architecture/
│   ├── decisions/                            # ADRs
│   ├── diagrams/
│   ├── api/
│   ├── onboarding/
│   └── conventions/
│
├── tooling/                                  # Shared toolchain configs
│   ├── eslint/  prettier/  tsconfig/
│   ├── tailwind/  husky/  scripts/
│
├── .github/                                  # CI/CD + issue templates
│   ├── workflows/
│   └── ISSUE_TEMPLATE/
│
└── ARCHITECTURE.md                           # ← this document
```

---

## 4. Folder-by-Folder Responsibilities

### 4.1 `apps/web/src/app/` — Routing Layer

**Purpose:** Next.js App Router route definitions **only**. Pages must remain thin: import a feature container from `modules/*`, render it, attach metadata. No business logic, no data fetching beyond simple server-side hydration.

- **Route Groups** `(auth)`, `(customer)`, `(provider)`, `(admin)` — provide role-isolated layouts and middleware without affecting URLs.
- **Dynamic Segments** `[id]` used for resource detail screens (tracking, chat, breakdown).
- **`/api`** — used **only** for BFF tasks: webhooks, secure proxies (Stripe, OpenAI), edge computations. The bulk of backend lives in `RoadGuard-AI-Backend`.

### 4.2 `apps/web/src/modules/` — Feature Modules

The heart of the app. Each module is a **vertical slice** containing every concern for one capability. A module never imports from another module's internals — they communicate only through their barrel `index.ts`, the Redux store, or the API layer.

Standard module shape:

```
modules/<feature>/
├── components/        UI specific to this feature (containers + dumb components)
├── hooks/             Feature-scoped hooks (useBreakdownFlow, …)
├── services/          API adapters / orchestrations
├── store/             slice.ts, selectors, actions, thunks
├── forms/             React Hook Form definitions
├── validations/       Zod schemas
├── types/             Module-local types (re-export shared from packages/types)
├── utils/             Pure helpers
├── constants/         Strings, enums, storage keys
├── api/               (optional) module-specific RTK Query slice
├── selectors/         Memoized cross-cutting selectors
└── index.ts           Public API (barrel) — the ONLY allowed import surface
```

### 4.3 `apps/web/src/components/` — Cross-module Shared Components

UI that is reused across multiple modules. Organized by **role in the UI taxonomy**, not by feature:

- `primitives/` — re-exports of ShadCN primitives from `packages/ui`
- `layouts/` — `<AppHeader>`, `<Sidebar>`, `<RoleSwitcher>`
- `navigation/`, `forms/`, `data-display/`, `feedback/`, `overlays/`
- `maps/`, `ai/`, `charts/`, `uploader/`, `empty-states/`, `loaders/`, `banners/`, `badges/`

### 4.4 `apps/web/src/layouts/` — Role-Specific Page Chrome

Each role gets a dedicated layout (sidebar, topbar, footer, mobile bottom nav). These are referenced from `app/(role)/layout.tsx`.

### 4.5 `apps/web/src/providers/` — Provider Composition

A single `<AppProviders>` composes (in order):

```
<ErrorBoundary>
  <ReduxProvider>
    <QueryProvider>
      <ThemeProvider>
        <I18nProvider>
          <FeatureFlagProvider>
            <AuthProvider>
              <PermissionProvider>
                <SocketProvider>
                  <NotificationProvider>
                    <AIProvider>
                      <ModalProvider>
                        <ToastProvider>
                          {children}
                        </ToastProvider>
                      </ModalProvider>
                    </AIProvider>
                  </NotificationProvider>
                </SocketProvider>
              </PermissionProvider>
            </AuthProvider>
          </FeatureFlagProvider>
        </I18nProvider>
      </ThemeProvider>
    </QueryProvider>
  </ReduxProvider>
</ErrorBoundary>
```

### 4.6 `apps/web/src/services/` — Infrastructure Adapters

Pure side-effect-ful adapters with **no UI**. They expose a typed interface that the rest of the app consumes. Replacing the underlying SDK (e.g., Stripe → Razorpay, Google Maps → Mapbox) means swapping just the adapter file.

### 4.7 `apps/web/src/store/` — Redux Toolkit Configuration

Root store wiring. Cross-module slices live here (UI state, session). Per-module slices live inside their module and are registered via barrel imports.

### 4.8 `apps/web/src/<infrastructure-folders>/`

`maps/`, `ai/`, `websocket/`, `offline/`, `caching/`, `uploads/`, `notifications/`, `permissions/`, `routes/`, `storage/`, `workers/`, `security/`, `a11y/`, `seo/`, `mocks/`, `test-utils/` — each is a dedicated subsystem with its own internal layering. See sections 8–13.

### 4.9 `packages/` — Shared Libraries

See [Section 18](#18-future-mobile-react-native-portability) for the rationale on why these are split out as packages rather than left in `apps/web`.

---

## 5. Data Flow Architecture

```
                      ┌────────────────────────────┐
                      │      User Interaction      │
                      └─────────────┬──────────────┘
                                    │
                                    ▼
        ┌─────────────────── PRESENTATION ───────────────────┐
        │   modules/*/components/*.tsx (React components)    │
        │                                                    │
        │   • Read state via selectors / RTK Query hooks     │
        │   • Dispatch actions / mutations on user events    │
        │   • Never call axios / fetch / sockets directly    │
        └─────────────────────────┬──────────────────────────┘
                                  │
                                  ▼
        ┌─────────────────── APPLICATION ────────────────────┐
        │   modules/*/hooks   modules/*/store/slice          │
        │                                                    │
        │   • Orchestrate business workflows                 │
        │   • Validate input with Zod / business validators  │
        │   • Compose API calls + optimistic updates         │
        └─────────────────────────┬──────────────────────────┘
                                  │
                                  ▼
        ┌──────────────────── DOMAIN ────────────────────────┐
        │   packages/business   packages/types               │
        │                                                    │
        │   • Pure functions (no I/O, no React)              │
        │   • State machines (XState) for complex workflows  │
        └─────────────────────────┬──────────────────────────┘
                                  │
                                  ▼
        ┌────────────────── INFRASTRUCTURE ──────────────────┐
        │   packages/api  services/* websocket  storage      │
        │                                                    │
        │   • Axios + RTK Query                              │
        │   • Socket.IO (real-time tracking, chat, SOS)      │
        │   • IndexedDB / localforage (offline cache)        │
        │   • Service worker (background sync, push)         │
        └────────────────────────────────────────────────────┘
```

**Golden Rules:**

1. Components never import from `services/*` directly — always through a hook.
2. Business logic functions accept and return **plain data**, never React state or Redux references.
3. The API layer always returns **typed DTOs**, normalized by `transformers/`.
4. Sockets push to Redux via dedicated middleware; components subscribe via selectors.
5. Side effects (analytics, logging) flow through Redux **listener middleware**, not inline in components.

---

## 6. State Management Architecture

Road Guard uses a **layered state model** with intentional choices per state type:

| State Type | Tool | Lifetime | Example |
|------------|------|----------|---------|
| **Server cache** | RTK Query | Until invalidation | Vehicle list, breakdown history, memberships |
| **Real-time state** | Redux slice (pushed via socket middleware) | While socket open | Live mechanic location, chat messages |
| **Global UI state** | Redux slice | Session | Theme, sidebar, role, locale |
| **Session/Auth** | Redux + secure storage | Until logout | Token, user, permissions |
| **Form state** | React Hook Form | While form is mounted | Login, breakdown request |
| **Ephemeral UI** | React `useState` / `useReducer` | While component mounted | Dropdown open, accordion |
| **Cross-tab sync** | BroadcastChannel + Redux | Session | Logout broadcast, theme sync |
| **Offline queue** | IndexedDB + Redux | Until synced | Pending requests, queued chats |
| **Feature flags** | `packages/config/feature-flags` + context | App lifetime | Beta features |

### Store Shape (simplified)

```ts
RootState = {
  // Cross-cutting slices
  ui: UISlice,
  session: SessionSlice,
  network: NetworkSlice,
  notifications: NotificationsSlice,
  realtime: RealtimeSlice,

  // RTK Query reducers
  api: ApiSlice.reducer,            // root api (auth, users, vehicles, …)
  trackingApi: TrackingApiSlice,    // high-frequency separate api
  aiApi: AIApiSlice,                // streaming/long-running

  // Feature modules — each module owns its slice
  auth: AuthSlice,
  breakdown: BreakdownSlice,
  vehicles: VehiclesSlice,
  tracking: TrackingSlice,
  chat: ChatSlice,
  wallet: WalletSlice,
  // …
}
```

### Why Redux Toolkit AND RTK Query?

- **RTK Query** owns server cache, automatic invalidation, polling, normalization.
- **Redux Toolkit** owns app/session/UI/real-time state that doesn't map cleanly to REST cache.
- **Listener middleware** glues them together (e.g., on `login.fulfilled`, prefetch dashboard).

### Selector Strategy

- All selectors use `createSelector` for memoization.
- Module-local selectors live in `modules/<feat>/selectors`.
- Cross-cutting selectors live in `apps/web/src/store/selectors`.
- Components consume selectors via typed `useAppSelector` hooks.

---

## 7. API Layer Architecture

The API layer lives in **`packages/api`** to keep it platform-agnostic.

```
packages/api/src/
├── client/
│   ├── axios/              # createAxiosClient({ baseURL, getToken })
│   ├── fetch/              # SSR/Edge fetch wrapper (RSC-safe)
│   ├── interceptors/
│   │   ├── auth.ts         # attach access token
│   │   ├── refresh.ts      # silent refresh + queue
│   │   ├── retry.ts        # exponential backoff
│   │   ├── error.ts        # normalize errors
│   │   └── tracing.ts      # correlation IDs
│   ├── auth/               # token store interface (web vs native)
│   ├── retry/              # retry policies (idempotent only)
│   └── error-handling/
├── endpoints/              # ONE folder per resource (auth, users, …)
│   └── <resource>/
│       ├── types.ts        # Request/response DTOs
│       ├── schemas.ts      # Zod schemas
│       ├── endpoints.ts    # RTK Query endpoints
│       └── adapter.ts      # Domain ↔ DTO transformers
├── rtk-query/
│   ├── base-query.ts       # baseQueryWithReauth
│   ├── tags.ts             # 'Vehicle' | 'Breakdown' | 'Tracking' | …
│   └── transformers/
├── sockets/
│   ├── client.ts           # Socket.IO factory
│   ├── handlers/           # Typed event handlers
│   ├── events.ts           # Event-name enum
│   ├── channels/
│   └── middleware.ts       # Redux middleware: dispatch on event
└── mocks/                  # MSW handlers (used in dev + tests)
```

### Request Lifecycle

```
Component
  └─ useGetBreakdownsQuery()              ← RTK Query hook
        └─ baseQueryWithReauth
              ├─ axios.get('/breakdowns')
              │     ├─ auth interceptor adds Bearer
              │     ├─ on 401 → refresh token, retry
              │     └─ on 5xx → exponential backoff
              ├─ Zod-validate response (dev only)
              └─ transform DTO → domain model
        └─ cache by tag 'Breakdown'
        └─ component re-renders
```

### Token Storage Abstraction

```ts
// packages/api/src/client/auth/token-store.ts
export interface TokenStore {
  getAccess(): Promise<string | null>;
  getRefresh(): Promise<string | null>;
  set(tokens: Tokens): Promise<void>;
  clear(): Promise<void>;
}
```

- **Web** implementation: HttpOnly cookie + in-memory cache + `localStorage` for non-sensitive bits.
- **Native** implementation (future): `expo-secure-store` / Keychain / Keystore.

The API layer never reads `localStorage` directly — it goes through `TokenStore`.

### Error Normalization

All errors are mapped to a `DomainError` shape:

```ts
{ code: 'NETWORK' | 'AUTH' | 'VALIDATION' | 'SERVER' | 'CONFLICT' | …,
  status?: number,
  message: string,
  details?: Record<string, unknown>,
  correlationId?: string }
```

This single shape is consumed by toasts, error boundaries, Sentry, and analytics — uniformly.

---

## 8. Real-time / Socket Architecture

Real-time is **first-class** because Road Guard's core value (live mechanic tracking, SOS, chat, request assignment) depends on it.

```
apps/web/src/websocket/
├── handlers/              # onTrackingUpdate, onRequestAssigned, …
├── events/                # Event name constants & payload types
├── channels/              # user:{id}, provider:{id}, admin, sos
├── rooms/                 # Room join/leave logic
├── reconnect/             # Backoff + jitter strategy
├── middleware/            # Redux middleware bridge
└── (typed event registry)
```

**Architecture:**

1. `SocketProvider` initializes the Socket.IO client after auth.
2. The client subscribes to channels based on user role + active resources (e.g. `tracking:{requestId}`).
3. A **Redux middleware** dispatches typed actions when events arrive.
4. RTK Query caches are updated optimistically via `updateQueryData`.
5. On disconnect, an exponential backoff with jitter reconnects; outgoing actions are queued in `offline/queue`.

**Channels (logical):**

| Channel | Used By | Events |
|---------|---------|--------|
| `user:{id}` | Customer | request status, chat, notification |
| `provider:{id}` | Provider | new request, route update |
| `tracking:{requestId}` | Both | location ticks (high frequency) |
| `sos:global` | Admin | SOS alerts (broadcast) |
| `admin:control` | Admin | system events |

---

## 9. Maps Abstraction Layer

Maps are notoriously hard to swap, so we **abstract** them on day one. Two providers are supported: **Google Maps** (preferred for India coverage) and **Mapbox** (fallback / cost-control / RN parity).

```
apps/web/src/maps/
├── adapters/
│   ├── google/             # Google Maps adapter (web)
│   └── mapbox/             # Mapbox adapter (web + future RN parity)
├── providers/              # <MapProvider> resolves which adapter to use
├── services/
│   ├── geocoding.ts        # forward/reverse
│   ├── directions.ts
│   ├── distance-matrix.ts
│   └── places.ts
├── hooks/                  # useMap, useMarker, usePolyline, useCurrentLocation
├── components/             # <Map>, <Marker>, <Polyline>, <RouteOverlay>
├── utils/                  # bbox, polyline encoding, clustering
└── types/                  # Provider-agnostic types
```

**API contract** (provider-agnostic):

```ts
interface MapAdapter {
  render(opts: MapOptions): MapInstance;
  addMarker(m: Marker): MarkerHandle;
  drawRoute(r: Route): RouteHandle;
  setCenter(coord: LatLng, zoom?: number): void;
  on(event: MapEvent, cb: MapEventHandler): Unsubscribe;
}
```

The same contract will be implemented by `react-native-maps` (Google) and `@rnmapbox/maps` (Mapbox) on mobile — **zero changes to feature code**.

---

## 10. AI / Voice Assistant Architecture

```
apps/web/src/ai/
├── agents/                 # Composable agents (Diagnosis, Triage, Concierge)
│   ├── diagnosis-agent.ts
│   ├── triage-agent.ts
│   └── concierge-agent.ts
├── prompts/                # Versioned prompt templates
├── memory/                 # Short-term + long-term memory adapters
├── tools/                  # Tool definitions (function calling)
│   ├── get-current-location.ts
│   ├── lookup-vehicle.ts
│   ├── create-request.ts
│   └── call-emergency.ts
├── voice/
│   ├── stt/                # Speech-to-text (Web Speech / Whisper)
│   ├── tts/                # Text-to-speech (Web Speech / ElevenLabs)
│   └── wake-word/          # Optional wake-word detection
├── chat/
│   ├── streaming/          # SSE/WebSocket streaming consumer
│   ├── messages/           # Message normalization
│   └── history/            # Persistence in IDB
├── vision/                 # Image-to-text (vehicle damage analysis)
└── diagnostics/            # Pre-defined diagnostic flows
```

**Design notes:**

- **All AI calls go through `/api/ai/*` BFF route handlers** — the OpenAI key is never shipped to the browser.
- **Tool calling** is used so the AI can invoke `createBreakdownRequest`, `findNearestProvider`, etc.
- **Streaming** is handled with Server-Sent Events; messages append to a Redux slice in real time.
- **Memory** is per-user and stored in IndexedDB + synced to backend.
- **Voice** wraps Web Speech API on web; on mobile, the same interface uses `expo-speech` / `expo-av`.

---

## 11. Offline-First & Caching Strategy

Stranded users often have flaky networks. The app must:

1. **Always load** (App shell + last-known data).
2. **Always accept input** (queue and sync later).
3. **Never lose data** (CRDT-style conflict resolution).

```
apps/web/src/offline/
├── queue/                  # Outbound action queue (IDB-backed)
├── sync/                   # Sync engine (on reconnect, drain queue)
├── storage/                # IDB schema, migrations
├── strategies/             # CacheFirst, NetworkFirst, StaleWhileRevalidate
└── resolvers/              # Conflict resolution

apps/web/src/caching/
├── strategies/             # HTTP-level cache strategies
├── policies/               # TTLs per resource
└── layers/                 # Memory → IDB → Network
```

- **Service Worker (Workbox)** caches the app shell, fonts, locales, marketing pages, ShadCN CSS.
- **RTK Query** owns the in-memory + persistable cache for API responses.
- **IndexedDB (via localforage)** holds:
  - Vehicle list, recent requests, chat history, AI memory
  - Pending mutations (offline queue)
  - i18n bundles for offline language switching
- **PWA Manifest** + `app/manifest.ts` makes the app installable.

---

## 12. Notification & Push Architecture

```
apps/web/src/notifications/
├── channels/               # In-app, push, email-bridge
├── templates/              # Reusable notification components
├── handlers/               # Route notification → action (deep-link)
└── inbox/                  # Persistent notification center
```

- **In-app toasts** via the toast provider, queued and deduplicated.
- **Browser Push** via Web Push API + FCM, registered through the service worker.
- **Server-sent updates** via the socket layer, dispatched to the `notifications` Redux slice.
- A central **notification dispatcher** routes any notification through correct channels based on user preferences.

---

## 13. Auth, Permissions & Role-Based Layouts

```
apps/web/src/permissions/
├── matrix.ts               # Role × Action × Resource matrix
├── guards/                 # withRole, withPermission HOCs / wrappers
├── policies/               # Higher-order policies (e.g., "can edit own only")
└── hooks/                  # useCan(action, resource)
```

- **Roles:** `customer`, `provider`, `admin`, `super_admin`, `support`.
- **Strategy:** RBAC for coarse permissions, ABAC for resource-level checks (e.g., "provider can only see assigned requests").
- **Middleware (`middleware.ts`)** at the edge:
  - Validates session cookie
  - Resolves role and redirects unauthorized users
  - Sets `x-user-role` header for downstream layouts
- **Layout selection** is automatic via route groups: `(customer)/layout.tsx` mounts `<CustomerLayout>`, etc.
- **Hooks** (`useCan`, `useRole`) wrap conditional rendering, enabling/disabling UI fragments per permission.

---

## 14. Routing, Lazy Loading & Code Splitting

### Route Organization

- Centralized route constants live in `packages/config/routes/` (e.g. `ROUTES.customer.dashboard()`).
- **Never** hardcode strings like `/dashboard` in components — always import from `routes`.
- Type-safe route builders generate query strings & dynamic segments.

### Code Splitting Strategy

1. **Route-level splitting** is automatic via App Router.
2. **Module-level splitting** for heavy features (AI assistant, maps) using `next/dynamic` with `ssr: false`.
3. **Vendor splitting** — `next.config.ts` configures `splitChunks` for `react`, `redux`, `maps`, `charts`.
4. **Conditional loading** — admin-only chunks are loaded only inside `(admin)` routes.
5. **Lazy-loading**:
   - Modal contents
   - Charts (heavy)
   - Voice assistant
   - Mapbox/Google adapters (only the chosen one is loaded)

### Protected Routes

- Edge `middleware.ts` for cookie-level checks (fast, no flash).
- Client-side `RoleGuard` for component-level checks.
- `useCan` for inline UI gating.

---

## 15. Internationalization Architecture

```
packages/localization/src/
├── locales/
│   ├── en/ hi/ mr/ es/ ar/ fr/
├── namespaces/             # Per-feature JSON files (auth.json, breakdown.json, …)
├── formatters/             # Currency, date, distance formatters
├── providers/              # next-intl provider
├── utils/                  # t() helper with type safety
└── types/                  # Typed translation keys
```

- **`next-intl`** drives translation at both Server and Client components.
- **Locale routing** via `app/[locale]/` would be enabled later if needed; today we use a cookie-based locale switch to keep URL stability.
- **Right-to-left (RTL)** support is baked into Tailwind via `dir` attribute and `rtl:` variant.
- **Translation keys are typed** — `t('auth.login.title')` is type-checked.
- **Pluralization & ICU MessageFormat** supported out of the box.
- **Offline language packs** are stored in IDB to switch language without re-fetching.

---

## 16. Theming & White-Labeling

```
packages/config/branding/
├── default/                # Road Guard
├── partner-a/              # White-label tenant A
└── partner-b/              # White-label tenant B
```

- **Design tokens** (color, spacing, radius, typography) live in `packages/ui/tokens`.
- **Tailwind theme** consumes tokens via CSS variables (`--rg-color-primary`, …).
- **Runtime tenant resolution**: hostname → tenant config → CSS variables injected into `<html>` style.
- **Dark mode** via `next-themes`; tokens have light + dark variants.
- **Brand-specific assets** (logo, favicon, OG) loaded from tenant config.

---

## 17. Scalability Strategy

| Concern | Strategy |
|---------|----------|
| **Codebase growth** | Feature-driven modules + barrel-only public APIs prevent cross-module coupling. |
| **Team scaling** | CODEOWNERS per `modules/*` and `packages/*`; ADRs in `docs/decisions/`. |
| **Build time** | Turborepo remote caching; per-package builds; `next.config.ts` with module aliases. |
| **Bundle size** | Tree-shakeable barrels; per-route splitting; dynamic imports for heavy SDKs. |
| **Runtime perf** | RSC by default; islands of interactivity; selective hydration; memoized selectors. |
| **API load** | RTK Query caching; tag-based invalidation; SSR for first paint; ISR for marketing pages. |
| **Real-time scale** | Per-resource socket rooms; aggressive throttling of location ticks; client-side smoothing. |
| **Mobile takeoff** | Move all logic to `packages/*` from day one. See [Section 18](#18-future-mobile-react-native-portability). |
| **Multi-region** | Edge middleware for routing; CDN for static; per-region API base URLs in env. |
| **Multi-tenant** | White-label config layer; tenant-aware theme + branding. |

---

## 18. Future Mobile (React Native) Portability

This architecture is engineered so that adding `apps/mobile` (Expo or bare RN) is a **scaffolding task, not a rewrite**.

### What Already Works on Mobile (Zero Changes)

| Package | Why it Portable |
|---------|-----------------|
| `packages/types` | Pure TypeScript |
| `packages/utils` | Pure functions, no DOM |
| `packages/business` | Pure logic + state machines |
| `packages/api` | Axios + Socket.IO work on RN |
| `packages/config` | Pure data |
| `packages/localization` | next-intl swap → `react-intl` or keep `next-intl` |
| `packages/hooks` (most) | React-only, no DOM |
| **Redux store** | RTK + RTK Query are platform-agnostic |
| **Validations** | Zod is platform-agnostic |
| **Forms** | React Hook Form works on RN |

### What Needs a Mobile Adapter

| Concern | Web | Native (future) |
|---------|-----|-----------------|
| **UI primitives** | ShadCN + Tailwind | `react-native` core + NativeWind / Tamagui |
| **Navigation** | Next.js App Router | React Navigation |
| **Storage** | localStorage / IndexedDB | `expo-secure-store` / MMKV |
| **Geolocation** | `navigator.geolocation` | `expo-location` |
| **Push** | Web Push + FCM | FCM/APNs via `expo-notifications` |
| **Maps** | Google/Mapbox web SDKs | `react-native-maps` / `@rnmapbox/maps` |
| **Voice** | Web Speech | `expo-speech` / `expo-av` |
| **Camera/Vision** | `getUserMedia` | `expo-camera` |
| **Service Worker / Offline** | Workbox | Background fetch + MMKV cache |

### The Pattern: Platform Adapter

Every cross-platform concern is exposed through a typed interface in `packages/*`, with a **web implementation in `apps/web/src/services/*`** and a future native implementation in `apps/mobile/src/services/*`.

Example:

```
packages/api/src/client/auth/token-store.ts        ← interface
apps/web/src/services/storage/web-token-store.ts   ← web impl
apps/mobile/src/services/storage/native-token-store.ts  ← future impl
```

This is sometimes called the **Hexagonal / Ports & Adapters** pattern. Everything inside `packages/*` is a "port"; everything inside `apps/*/services` is an "adapter."

### Migration Playbook (when ready)

1. `pnpm create expo apps/mobile` (or `apps/native`).
2. Symlink `packages/*` via workspace.
3. Implement adapters in `apps/mobile/src/services/*`.
4. Replace `app/` router with React Navigation screens that import the **same** `modules/*/components` (already platform-agnostic where the component uses only `packages/ui` primitives).
5. Swap `packages/ui/adapters/web` → `packages/ui/adapters/native`.
6. Ship.

---

## 19. Microfrontend Readiness

Although Road Guard launches as a single Next.js app, the structure leaves clear seams to split later:

- **Route groups** `(customer)`, `(provider)`, `(admin)` could each become independent Next.js apps mounted under a single host using Module Federation or Vercel multi-zone routing.
- **Each `packages/*`** would be published as a private npm package.
- **Each module's barrel `index.ts`** is the natural module-federation contract.
- **Shared providers** (Redux, theme, i18n) become a runtime "shell" delivered by the host.

---

## 20. Naming, Folder, and Import Conventions

### Naming

| Item | Convention | Example |
|------|------------|---------|
| Folders | `kebab-case` | `ai-assistant/` |
| Components | `PascalCase.tsx` | `BreakdownCard.tsx` |
| Hooks | `camelCase.ts`, prefix `use` | `useBreakdownFlow.ts` |
| Slices | `<feature>.slice.ts` | `breakdown.slice.ts` |
| RTK Query | `<feature>.api.ts` | `breakdown.api.ts` |
| Types | `<feature>.types.ts` | `breakdown.types.ts` |
| Zod schemas | `<feature>.schema.ts` | `breakdown.schema.ts` |
| Constants | `SCREAMING_SNAKE_CASE` | `MAX_PHOTO_SIZE_MB` |
| Selectors | `select<Thing>` | `selectActiveBreakdown` |
| Events (sockets) | `<resource>:<verb>` | `tracking:update` |
| Routes constants | namespaced object | `ROUTES.customer.dashboard()` |

### Folder

- Every module **must** expose only its `index.ts`. Cross-imports of `modules/x/components/Y` from another module are forbidden (ESLint enforced).
- `components/` inside a module = feature-specific. `components/` at the app level = cross-feature.
- Tests co-locate next to source as `*.test.ts(x)` or in `__tests__/`.

### Imports

A standard import order is enforced by ESLint + `import/order`:

```
1. React / next
2. Third-party (axios, redux, zod, …)
3. @road-guard/* packages
4. App-local (src/*)
5. Module-local (relative)
6. Styles
```

Path aliases (configured in `tooling/tsconfig`):

```jsonc
{
  "@/*":               ["./src/*"],
  "@modules/*":        ["./src/modules/*"],
  "@components/*":     ["./src/components/*"],
  "@providers/*":      ["./src/providers/*"],
  "@services/*":       ["./src/services/*"],
  "@store/*":          ["./src/store/*"],
  "@hooks/*":          ["./src/hooks/*"],
  "@routes/*":         ["./src/routes/*"],
  "@theme/*":          ["./src/theme/*"],
  "@rg/ui":            ["../../packages/ui/src"],
  "@rg/types":         ["../../packages/types/src"],
  "@rg/utils":         ["../../packages/utils/src"],
  "@rg/api":           ["../../packages/api/src"],
  "@rg/config":        ["../../packages/config/src"],
  "@rg/business":      ["../../packages/business/src"],
  "@rg/hooks":         ["../../packages/hooks/src"],
  "@rg/localization":  ["../../packages/localization/src"]
}
```

### Barrel Export Strategy

- Each leaf folder exports through `index.ts`.
- Each module exports a **curated** public API — _not_ a wildcard.
- Wildcard exports are banned at the module level (linted).

---

## 21. Environment & Configuration Management

```
packages/config/src/env/
├── schema.ts                # Zod-validated process.env contract
├── client.ts                # NEXT_PUBLIC_* only
├── server.ts                # secrets — never imported client-side
└── index.ts
```

- All `process.env` access goes through **typed accessors**; raw access is ESLint-banned.
- Schema validation runs at **build time** and **boot time** — a missing env var fails fast.
- `.env.local`, `.env.development`, `.env.staging`, `.env.production` files are supported.
- Secrets are never bundled — only `NEXT_PUBLIC_*` reach the browser, and even those are validated against the **client schema** which is a subset of the server schema.
- Feature flags read from env at boot but can be overridden at runtime by `packages/config/feature-flags`.

---

## 22. Testing Strategy

| Layer | Tool | Scope |
|-------|------|-------|
| **Unit** | Vitest | `packages/business`, `packages/utils`, slices, validators |
| **Component** | Vitest + React Testing Library | UI components in isolation |
| **Hook** | Vitest + RTL | All custom hooks |
| **Integration** | Vitest + MSW | Module-level flows (login, breakdown create) |
| **E2E** | Playwright | Critical journeys per role |
| **Visual** | Storybook + Chromatic | All `packages/ui` components |
| **Contract** | Zod schemas + MSW | API response shape verification |
| **Accessibility** | `@axe-core/playwright` + Storybook a11y addon | All pages & components |
| **Performance** | Lighthouse CI + Web Vitals reporter | All routes |

- MSW handlers live in `packages/api/src/mocks/` — used by dev, tests, and Storybook for **the same fixtures**.

---

## 23. Security & Compliance

- **CSP** via Next.js headers + nonces.
- **HttpOnly + Secure cookies** for tokens; refresh tokens never reach JS.
- **XSS**: only sanitized HTML via DOMPurify; no `dangerouslySetInnerHTML` outside `security/`.
- **CSRF**: double-submit cookie pattern for non-RTK-Query mutations.
- **Sensitive logs**: structured logger redacts PII and tokens.
- **Encryption at rest**: IDB-stored sensitive data wrapped with Web Crypto AES-GCM via `services/encryption`.
- **OWASP Top 10** checklist enforced in CI (eslint-plugin-security, dependency audit).
- **SOC2 / GDPR alignment**: data-export and account-delete flows are first-class in `modules/settings`.

---

## 24. Observability, Logging & Analytics

- **Error tracking**: Sentry (front-end + source maps).
- **Performance**: Web Vitals reporter → backend metrics endpoint.
- **Product analytics**: Pluggable adapter (`services/analytics`) supporting PostHog, GA4, Mixpanel.
- **AI telemetry**: Token usage, latency, success rate per agent — visible in `(admin)/ai-monitoring`.
- **Structured logger**: `packages/utils/logger` — leveled, redacted, transport-pluggable (console, Sentry breadcrumbs, backend).
- **Correlation IDs**: Generated client-side, attached to every API request and socket connect for end-to-end tracing.

---

## 25. Deployment-Ready Considerations

- **Hosting**: Vercel (primary) or self-host on Node 20 with `next start`. Edge middleware on Vercel Edge or Cloudflare Workers.
- **CDN**: Static assets, fonts, locales pre-built and pushed to CDN.
- **CI/CD** (`.github/workflows/`):
  - `pr.yml` → typecheck, lint, unit, contract, build
  - `e2e.yml` → Playwright on preview deployments
  - `deploy.yml` → promote build to staging → prod (manual approval)
  - `dependency-review.yml` → SCA on PRs
- **Image optimization**: `next/image` + remote loader; OG images via `@vercel/og`.
- **PWA**: Manifest + service worker registered; offline shell available.
- **Sitemap & SEO**: Generated via `app/sitemap.ts` + `robots.ts`; per-route metadata; OpenGraph; structured data.
- **Performance budgets**: enforced per route via Lighthouse CI.
- **Environment promotion**: dev → preview → staging → production, each with its own typed env schema.
- **Rollback**: Vercel deployment URLs are immutable; instant rollback via promote-previous-deployment.
- **Feature flags**: Long-lived flags promoted via `packages/config/feature-flags`; short-lived via env.
- **Internationalized SEO**: hreflang + per-locale sitemaps; locale-specific OG.

---

## 26. Best Practices Summary

- ✓ **Always** put new business logic in `packages/business`, not in a component.
- ✓ **Always** add new types to `packages/types`, never inline in components.
- ✓ **Always** wrap third-party SDKs in `services/*` adapters.
- ✓ **Always** use `packages/config/routes` for navigation; never hardcode URLs.
- ✓ **Always** validate API responses with Zod in dev.
- ✓ **Always** add a tag to RTK Query endpoints (cache invalidation).
- ✓ **Always** add a new slice through `createSlice` + listener middleware.
- ✓ **Always** localize new strings; never hardcode user-facing text.
- ✓ **Always** add new components to Storybook with a11y checks.
- ✗ **Never** import from another module's internals — only its barrel.
- ✗ **Never** call `axios` / `fetch` / `socket.io-client` directly from a component.
- ✗ **Never** touch `window` / `document` outside `services/*` or hooks gated by `useIsClient`.
- ✗ **Never** read `process.env` directly; use `packages/config/env`.
- ✗ **Never** put feature code in `app/` — pages are thin shells.
- ✗ **Never** create cross-app coupling — packages are the only shared surface.

---

## Appendix A — Module Public API Contract

Every module's `index.ts` exposes exactly four kinds of artifacts:

```ts
// Pages / containers (consumed by app/*)
export { BreakdownDashboardPage } from './components/BreakdownDashboardPage';

// Hooks (consumed by other modules / providers)
export { useBreakdownFlow } from './hooks/useBreakdownFlow';

// Selectors (consumed for cross-cutting reads)
export { selectActiveBreakdown } from './selectors';

// Slice & reducer (registered by the root store)
export { breakdownSlice, breakdownReducer } from './store/breakdown.slice';
```

Anything else is private to the module.

---

## Appendix B — Provider Composition Order Rationale

The provider stack order is **not** arbitrary:

1. **ErrorBoundary** — catches everything inside.
2. **Redux** — store must exist before any hook that selects from it.
3. **Query** — RTK Query needs the store.
4. **Theme** — must wrap UI before render.
5. **I18n** — must wrap before any translated string is rendered.
6. **FeatureFlag** — gates everything below.
7. **Auth** — many providers below depend on a known user.
8. **Permission** — derived from auth.
9. **Socket** — connects only after auth resolved.
10. **Notification** — depends on socket.
11. **AI** — needs auth + notifications.
12. **Modal/Toast** — UI overlays, last so they're always available.

---

## Appendix C — File Skeleton Conventions

When implementing a new module, the standard files (created per `modules/<x>/`) are:

```
modules/<x>/
├── components/
│   ├── <X>Page.tsx                  # Page container
│   ├── <X>List.tsx
│   ├── <X>Card.tsx
│   └── index.ts
├── hooks/
│   ├── use<X>.ts                    # Primary feature hook
│   ├── use<X>Form.ts
│   └── index.ts
├── services/
│   ├── <x>.service.ts               # Orchestrations
│   └── index.ts
├── store/
│   ├── <x>.slice.ts
│   ├── <x>.selectors.ts
│   ├── <x>.actions.ts
│   ├── <x>.listeners.ts
│   └── index.ts
├── forms/
│   ├── <x>-create.form.ts
│   └── index.ts
├── validations/
│   ├── <x>.schema.ts
│   └── index.ts
├── types/
│   ├── <x>.types.ts
│   └── index.ts
├── utils/
├── constants/
└── index.ts                         # Public barrel
```

---

**End of architecture document. See `docs/decisions/` for ADRs and `docs/onboarding/` for new-developer guides.**
