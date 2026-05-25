# @rg/ui — Portable Component Library

ShadCN-based component library that powers `apps/web` today and `apps/mobile` (React Native) tomorrow.

## Layout

```
src/
├── primitives/           Low-level base primitives (Button, Input, Dialog, …)
├── components/           Composed components built from primitives
│   ├── forms/  navigation/  feedback/  overlays/
│   ├── data-display/  layout/  maps/  ai/  charts/
├── icons/                Iconography (SVG sprites or react-icons wrappers)
├── theme/                Design tokens, theme provider
├── tokens/               Spacing, color, radius, typography scales
├── adapters/
│   ├── web/              Tailwind/CSS-variable adapter
│   └── native/           (Future) React Native StyleSheet adapter
├── hooks/                Library-internal hooks
├── utils/                Library-internal utilities (cn, mergeRefs, …)
└── types/                Public types
```

## How portability works

Each primitive is implemented twice:

```
primitives/Button/
├── Button.tsx                 Shared API (props, behavior)
├── Button.web.tsx             Web implementation (Tailwind + HTML)
└── Button.native.tsx          (Future) RN implementation
```

The platform bundler picks the right file via:

- Next.js: standard `.web.tsx` resolution
- React Native: Metro `.native.tsx` resolution

The **shared file** exports prop types and behavior, the platform files render.

Composed components above primitives are **identical** on both platforms — they only consume primitives.

## Design Tokens

Tokens live in `tokens/` and are exported as a TypeScript object:

```ts
export const tokens = {
  color: { primary: { 50: '…', 500: '…', 900: '…' } },
  spacing: { 1: 4, 2: 8, 3: 12, 4: 16, … },
  radius: { sm: 4, md: 8, lg: 16 },
  typography: { … },
}
```

The web adapter maps these tokens to **CSS variables** consumed by Tailwind:

```css
:root { --rg-color-primary-500: …; }
```

The native adapter will map the same tokens to RN `StyleSheet`.

## Theming + White-labeling

- A `<ThemeProvider tenant="default">` injects the right token map.
- Dark mode is just an alternate token map.
- White-label tenants override only the colors they need; everything else is inherited.
