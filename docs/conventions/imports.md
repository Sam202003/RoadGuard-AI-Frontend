# Import Conventions

## Import Order (enforced by ESLint `import/order`)

1. **Side-effect imports** — `import 'reflect-metadata';`
2. **Built-in Node** — `import { join } from 'node:path';`
3. **React / Next** — `import { useState } from 'react';`
4. **Third-party** — `import axios from 'axios';`
5. **`@rg/*` packages** — `import { calculatePrice } from '@rg/business';`
6. **App aliases** (`@/`, `@modules/`, …) — `import { ROUTES } from '@/routes';`
7. **Relative** — `import { BreakdownCard } from './BreakdownCard';`
8. **Styles** — `import './styles.css';`

Each group is separated by a blank line.

## Path aliases

```jsonc
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
```

## Forbidden Imports

- ✗ `import X from '@/modules/<other>/internals/Y'` — only the barrel is allowed.
- ✗ `import { something } from '../../../../utils/x'` — too deep; use alias or promote.
- ✗ `import axios from 'axios'` from a component — go through a hook.
- ✗ `import { localStorage } from …` from a `package/*` — packages must be platform-agnostic.
- ✗ Wildcard re-exports from a module's `index.ts` — be explicit.

## Barrel exports

- Each module's `index.ts` re-exports a **curated** public API.
- Each leaf folder exports through a local `index.ts` if it has >1 export.
- Wildcard `export *` is allowed inside packages only when re-exporting a sub-folder that is itself curated.
