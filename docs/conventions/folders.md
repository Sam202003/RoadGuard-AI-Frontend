# Folder Conventions

## Top-level

```
RoadGuard-AI-Frontend/
├── apps/             Runnable applications
├── packages/         Shared, platform-agnostic libraries
├── docs/             Architecture & convention documentation
├── tooling/          Shared eslint / prettier / tsconfig / tailwind
└── .github/          CI/CD workflows and templates
```

## `apps/web/src/`

```
src/
├── app/              Next.js App Router (routes only)
├── modules/          Feature-driven domain modules (vertical slices)
├── components/       Cross-module shared UI
├── layouts/          Role-specific page chrome
├── providers/        React context providers
├── store/            Redux Toolkit root
├── services/         Infrastructure adapters (API, sockets, …)
├── hooks/            App-wide hooks
├── routes/           Route constants & builders
├── permissions/      RBAC matrix & guards
├── theme/            Tailwind theme + tokens
├── config/           App-level config wiring
├── ai/               AI agents, prompts, voice, vision
├── maps/             Maps abstraction layer
├── websocket/        Real-time handlers
├── offline/          Offline queue & sync
├── caching/          Cache strategies
├── notifications/    Notification system
├── uploads/          File upload system
├── storage/          IDB schema & repositories
├── workers/          Web/Service workers
├── i18n/             Locale loaders
├── security/         CSP, sanitizers
├── a11y/             Accessibility utilities
├── seo/              Metadata, sitemap
├── styles/           Global CSS
├── types/            App-wide types
├── utils/            App-wide utilities
├── constants/        App-wide constants
├── forms/            Cross-module form schemas
├── validations/      Cross-module Zod schemas
├── lib/              Framework-specific glue
├── middleware-utils/ Helpers for middleware.ts
├── test-utils/       Render helpers, mocks
└── mocks/            MSW handlers
```

## Module Folder

Every `modules/<feature>/` follows the **same** shape:

```
<feature>/
├── components/
├── hooks/
├── services/
├── store/
├── forms/
├── validations/
├── types/
├── utils/
├── constants/
├── api/         (optional)
├── selectors/
└── index.ts     Public barrel
```

## Package Folder

Every `packages/<name>/` follows:

```
<name>/
├── src/
│   ├── …
│   └── index.ts     Public barrel
├── package.json
├── tsconfig.json
└── README.md
```

## Component Folder

For non-trivial components:

```
ComponentName/
├── ComponentName.tsx
├── ComponentName.test.tsx
├── ComponentName.stories.tsx
├── ComponentName.module.css   (only if Tailwind cannot cover)
├── sub-components/            (only for compound components)
└── index.ts
```

## When to promote code

- Used in 2+ modules in `apps/web/src/modules/`? → promote to `apps/web/src/components/` or `apps/web/src/hooks/`.
- Used in 2+ apps OR likely to be used by future mobile? → promote to a `package/*`.
- A pure function with no React / browser dependency? → it belongs in `packages/utils/` or `packages/business/`.
