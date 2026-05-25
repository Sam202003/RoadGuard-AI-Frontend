# src/modules — Feature-Driven Domain Modules

The heart of the application. Each module is a **vertical slice** that contains every concern for one business capability.

## Standard Module Shape

```
modules/<feature>/
├── components/        UI specific to this feature (containers + dumb)
├── hooks/             Feature-scoped hooks
├── services/          API adapters / orchestrations
├── store/             slice.ts, selectors, actions, listeners, thunks
├── forms/             React Hook Form definitions
├── validations/       Zod schemas
├── types/             Module-local types (re-exports from @rg/types)
├── utils/             Pure helpers (consider promoting to @rg/utils)
├── constants/         Strings, enums, storage keys
├── api/               (optional) module-specific RTK Query slice
├── selectors/         Memoized cross-cutting selectors
└── index.ts           Public API (barrel) — the ONLY allowed import surface
```

## Customer Modules

| Module | Responsibility |
|--------|----------------|
| `auth` | Login, register, OTP, password reset, session |
| `home` | Public marketing-style landing inside the app |
| `dashboard` | Customer dashboard (active request, quick actions, recents) |
| `vehicles` | Vehicle CRUD + insurance + documents |
| `breakdown` | Create / view breakdown request, photos, AI triage |
| `tracking` | Live tracking of assigned provider on map |
| `ai-assistant` | Chat with the AI diagnostician |
| `voice-assistant` | Voice-driven assistant |
| `memberships` | Subscription plans + benefits |
| `wallet` | Wallet balance, top-ups, transactions |
| `payments` | Payment methods + checkout flows |
| `notifications` | In-app notification inbox + preferences |
| `sos` | One-tap emergency flow |
| `chat` | 1:1 chat with provider or support |
| `service-history` | Past requests + invoices + reviews |
| `profile` | Profile, contacts, documents |
| `settings` | App settings, language, privacy, data export |

## Provider Modules (`modules/provider/*`)

| Module | Responsibility |
|--------|----------------|
| `dashboard` | KPI overview + active job |
| `requests` | Incoming request feed + accept/reject |
| `navigation` | Turn-by-turn navigation to customer |
| `earnings` | Earnings reports + payouts |
| `availability` | Online/offline toggle + working hours |
| `service-history` | Past jobs + ratings |
| `reviews` | Customer reviews + responses |
| `kyc` | KYC verification flow |

## Admin Modules (`modules/admin/*`)

| Module | Responsibility |
|--------|----------------|
| `dashboard` | Operational overview + alerts |
| `users` | User management, search, ban |
| `providers` | Provider management, onboarding, suspension |
| `requests` | All requests monitoring + dispute resolution |
| `payments` | Payments, refunds, reconciliation |
| `memberships` | Plan CRUD + pricing |
| `analytics` | Cohort analysis, funnels, retention |
| `complaints` | Complaint ticket system |
| `emergency` | SOS monitoring + dispatch |
| `cms` | Content management for app content |
| `notifications` | Broadcast notification composer |
| `ai-monitoring` | AI agent telemetry, prompts, costs |
| `settings` | System settings, feature flags, branding |

## Inter-Module Communication Rules

1. A module **must not** import another module's internals. Only `import { … } from '@/modules/<other>'` (the barrel) is allowed.
2. Modules share state through the **Redux store** or **RTK Query cache** — never through direct hook calls into another module's internal hooks.
3. Cross-module orchestration belongs in `packages/business/workflows`, not in any single module.
4. Page composition (e.g., a tracking page that uses both `tracking` and `chat`) happens at the **`app/` route level**, not by cross-importing.
