# ADR-0002: Feature-Driven Modular Architecture

- **Status:** Accepted
- **Date:** 2026-05-12

## Context

Road Guard has many features: authentication, vehicle management, breakdown requests, live tracking, AI assistant, wallet, payments, memberships, chat, notifications, SOS, plus full provider and admin portals. A layered "all-components-in-one-folder" approach is unmaintainable at this scale.

## Decision

Organize the code by **feature**, not by file type. Each feature lives in `apps/web/src/modules/<feature>/` and contains every concern: components, hooks, services, store, forms, validations, types, utils, constants.

Cross-feature reuse goes through:

- `packages/*` for portable logic
- `apps/web/src/components/*` for shared UI
- `apps/web/src/providers/*` for cross-cutting state

## Consequences

- Onboarding is faster — you read one folder, you understand one feature.
- Refactoring is localized; cross-module accidental coupling is impossible.
- Teams own modules; CODEOWNERS reflects feature ownership.
- Some code duplication may emerge across modules — solved by promoting into `packages/*`.
