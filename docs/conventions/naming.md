# Naming Conventions

| Item | Convention | Example |
|------|------------|---------|
| Folders | `kebab-case` | `ai-assistant/` |
| Files (components) | `PascalCase.tsx` | `BreakdownCard.tsx` |
| Files (other) | `kebab-case.ts` | `format-currency.ts` |
| Hooks | `camelCase`, `use` prefix | `useBreakdownFlow.ts` |
| Slices | `<feature>.slice.ts` | `breakdown.slice.ts` |
| RTK Query | `<feature>.api.ts` | `breakdown.api.ts` |
| Selectors | `<feature>.selectors.ts` | `breakdown.selectors.ts` |
| Listeners | `<feature>.listeners.ts` | `auth.listeners.ts` |
| Zod schemas | `<feature>.schema.ts` | `breakdown.schema.ts` |
| Form definitions | `<feature>-<purpose>.form.ts` | `breakdown-create.form.ts` |
| Types | `<feature>.types.ts` | `breakdown.types.ts` |
| Service | `<feature>.service.ts` | `auth.service.ts` |
| Constants | `SCREAMING_SNAKE_CASE` | `MAX_PHOTO_SIZE_MB` |
| Variables, functions | `camelCase` | `formatCurrency` |
| Types, interfaces, classes | `PascalCase` | `BreakdownRequest` |
| Branded type IDs | `<Resource>Id` | `BreakdownId` |
| Selector functions | `select<Thing>` | `selectActiveBreakdown` |
| Socket events | `<resource>:<verb>` | `tracking:update` |
| Route constants | namespaced object | `ROUTES.customer.dashboard()` |
| Test files | `<sibling>.test.ts(x)` | `Button.test.tsx` |
| Storybook files | `<component>.stories.tsx` | `Button.stories.tsx` |
| MSW handlers | `<resource>.handlers.ts` | `vehicle.handlers.ts` |

## React Components

- Functional components only.
- Default exports only for pages (`page.tsx`) and lazy-loadable boundaries; named exports otherwise.
- Props interface named `<Component>Props`.
- Component file co-located with its `.test.tsx`, `.stories.tsx`, optional `.module.css`.

## Folder co-location

```
components/Button/
├── Button.tsx
├── Button.test.tsx
├── Button.stories.tsx
└── index.ts
```
