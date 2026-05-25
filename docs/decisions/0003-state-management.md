# ADR-0003: Redux Toolkit + RTK Query as Primary State

- **Status:** Accepted
- **Date:** 2026-05-12

## Context

We have multiple kinds of state: server cache, real-time state, session, UI, forms, offline queue. Different state needs different tools, but we want a **single mental model**.

## Decision

- **RTK Query** owns server cache (queries, mutations, tag-based invalidation).
- **Redux Toolkit slices** own session, UI, real-time, offline queue, AI conversation.
- **React Hook Form** owns form state (with Zod for validation).
- **`useState` / `useReducer`** own ephemeral component-local state.
- **`createListenerMiddleware`** wires side effects.
- **`localforage` / IndexedDB** + a custom persist layer handle long-lived storage; sensitive slices are **never** persisted.

## Why not Zustand / Jotai?

- Redux Toolkit + RTK Query is the most battle-tested combination for an enterprise app with this much real-time + offline + multi-role complexity.
- The RTK Query cache is a major asset — re-implementing it on Zustand is non-trivial.
- DevTools, time-travel debugging, and persistence are all first-class with Redux.

## Why also TanStack Query?

It is allowed only for **non-core** data (e.g., third-party widget data) where the RTK Query slice would be overhead. The default remains RTK Query.

## Consequences

- Slightly larger initial bundle; mitigated by tree-shaking.
- Devs must learn slices + RTK Query — well documented and standard.
- Migration to React Native is trivial — RTK works unchanged.
