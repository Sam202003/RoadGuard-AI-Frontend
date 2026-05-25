# modules/breakdown — Breakdown Request Module

End-to-end breakdown request creation, viewing, and lifecycle management for customers.

## Folder Shape

```
breakdown/
├── components/
│   ├── BreakdownDashboardPage.tsx       Container for /breakdown
│   ├── BreakdownDetailPage.tsx          Container for /breakdown/[id]
│   ├── CreateBreakdownPage.tsx          Container for /breakdown/new
│   ├── BreakdownCard.tsx
│   ├── BreakdownStatusTimeline.tsx
│   ├── BreakdownPhotoUploader.tsx
│   ├── BreakdownTypeSelector.tsx
│   ├── AITriageSummary.tsx
│   └── …
├── hooks/
│   ├── useBreakdownFlow.ts              Primary orchestrator hook
│   ├── useCreateBreakdown.ts
│   ├── useBreakdownById.ts
│   ├── useBreakdownPhotos.ts
│   └── useBreakdownStatusUpdates.ts     Subscribes to socket events
├── services/
│   └── breakdown.service.ts             Compose API + business rules
├── store/
│   ├── breakdown.slice.ts
│   ├── breakdown.selectors.ts
│   ├── breakdown.listeners.ts
│   └── breakdown.actions.ts
├── forms/
│   └── breakdown-create.form.ts
├── validations/
│   └── breakdown.schema.ts
├── types/
│   └── breakdown.types.ts                Module-local types only
├── utils/
├── constants/
├── api/                                  (optional) per-module RTK Query
├── selectors/
└── index.ts                              Public barrel
```

## Public API (`index.ts`)

Exposes only:

- Page containers (consumed by `app/(customer)/breakdown/**/page.tsx`)
- Primary hooks (`useBreakdownFlow`)
- Cross-cutting selectors (`selectActiveBreakdown`)
- Slice + reducer (for store registration)

## Data Flow Example: Creating a Breakdown

```
User taps "Request Help"
   ↓
CreateBreakdownPage → useCreateBreakdown()
   ↓
useCreateBreakdown:
   1. Read current GPS (services/geolocation)
   2. Snap to vehicle (selectActiveVehicle)
   3. Validate input with Zod
   4. (Optional) AI triage call (services/ai)
   5. Dispatch createBreakdownMutation (RTK Query)
   6. Optimistic UI update
   7. Navigate to /tracking/[id]
   ↓
On success → socket subscribes to tracking:{requestId}
On failure → queued in offline/queue for retry
```

## Module-level Workflow

The state machine lives in `@rg/business/workflows/breakdown` — this module's hooks **send events** to it but never duplicate the rules.
