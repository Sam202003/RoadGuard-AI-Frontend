# src/theme — Tailwind Theme + Design Tokens

Wires `@rg/ui/tokens` into the Tailwind config and CSS variables.

| File | Purpose |
|------|---------|
| `tokens.ts` | Re-export of `@rg/ui/tokens` for app-local consumers |
| `tailwind.theme.ts` | Tailwind `theme.extend` consuming tokens via CSS variables |
| `tenant.ts` | Tenant-aware token override resolver |
| `dark.ts` | Dark-mode token overrides |
| `index.ts` | Public exports |

## CSS variable strategy

At runtime, the resolved tenant + theme injects CSS variables into `<html>`:

```css
:root {
  --rg-color-primary-500: #4f46e5;
  --rg-color-bg:         #ffffff;
  --rg-radius-md:        0.5rem;
}

.dark {
  --rg-color-bg: #0b0b0f;
}
```

Tailwind then consumes them:

```ts
// tailwind.config.ts
colors: {
  primary: 'rgb(var(--rg-color-primary-500) / <alpha-value>)',
  bg:      'rgb(var(--rg-color-bg) / <alpha-value>)',
}
```

This enables:

- Tenant overrides without rebuilding Tailwind.
- Dark mode without a separate stylesheet.
- React Native parity (RN consumes the same token map, just not as CSS vars).
