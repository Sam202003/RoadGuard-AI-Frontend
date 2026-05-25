# @rg/business — Pure Business Logic

Domain rules, calculators, workflows, and state machines. **Zero** I/O, **zero** UI, **zero** framework — only types from `@rg/types` and pure code.

| Folder | Purpose |
|--------|---------|
| `rules/` | Predicates / policies — `isEligibleForFreeService(user, plan)`, `canCancelBreakdown(req, now)` |
| `calculators/pricing/` | Service price = base + distance + surge + tax |
| `calculators/distance/` | Haversine, road-distance via API result |
| `calculators/eta/` | ETA from distance + traffic + provider availability |
| `calculators/billing/` | Invoice line items, totals, refunds |
| `calculators/tax/` | GST / VAT computations |
| `validators/` | Pure validators — `validateVehiclePlate('MH12AB1234')` |
| `workflows/breakdown/` | Request lifecycle: `Draft → Created → Assigned → InProgress → Completed → Reviewed` |
| `workflows/tracking/` | Tracking lifecycle |
| `workflows/payment/` | Checkout / refund flows |
| `workflows/membership/` | Subscribe / cancel / renew |
| `workflows/kyc/` | Provider KYC submission & verification |
| `workflows/sos/` | Emergency SOS escalation |
| `policies/` | Higher-order access policies |
| `state-machines/` | XState definitions for complex flows |
| `domain/` | Domain primitives — `Money`, `Coordinates`, `PhoneNumber` |
| `errors/` | Domain-specific error classes |

## Why this is a separate package

- 100% reusable on React Native.
- 100% unit-testable without a browser or DOM.
- Decouples business rules from UI changes — refactor the UI without breaking logic.
- Enables backend code to import the same package (Node-friendly) if we ever share types/rules across the stack.

## Pattern: a Calculator

```ts
// Pure, deterministic, easy to test:
export function calculateServicePrice(input: PricingInput): Money {
  const base   = baseFareFor(input.vehicleClass, input.serviceType);
  const dist   = distanceCharge(input.distanceMeters);
  const surge  = surgeMultiplier(input.demand);
  const tax    = computeTax(base.plus(dist).times(surge), input.region);
  return base.plus(dist).times(surge).plus(tax);
}
```

## Pattern: a Workflow as a State Machine

```ts
// Using XState — defines transitions, guards, side-effect descriptions (not executions).
export const breakdownMachine = setup({ … }).createMachine({
  initial: 'draft',
  states: {
    draft:       { on: { SUBMIT: 'created' } },
    created:     { on: { ASSIGN: 'assigned', CANCEL: 'cancelled' } },
    assigned:    { on: { START: 'inProgress' } },
    inProgress:  { on: { COMPLETE: 'completed' } },
    completed:   { on: { REVIEW: 'reviewed' } },
    cancelled:   { type: 'final' },
    reviewed:    { type: 'final' },
  }
});
```

Workflow code never calls `axios` — it returns a description of what should happen; the application layer executes it.
