# @rg/localization — Internationalization

Translation bundles + tooling. Backed by `next-intl` on web; the same JSON bundles work with `react-intl` on native.

## Layout

```
src/
├── locales/
│   ├── en/                    English (default)
│   ├── hi/                    Hindi
│   ├── mr/                    Marathi
│   ├── es/                    Spanish
│   ├── ar/                    Arabic (RTL)
│   └── fr/                    French
├── namespaces/                Per-feature JSON files (auth, breakdown, …)
├── formatters/                Currency, date, distance formatters
├── providers/                 next-intl provider
├── utils/                     t() helper with type safety
└── types/                     Typed translation key paths
```

## Namespaces

One JSON per feature, mirroring the modules:

```
locales/en/
├── common.json
├── auth.json
├── home.json
├── dashboard.json
├── vehicles.json
├── breakdown.json
├── tracking.json
├── ai.json
├── memberships.json
├── wallet.json
├── payments.json
├── notifications.json
├── sos.json
├── chat.json
├── profile.json
├── settings.json
├── provider.json
├── admin.json
└── errors.json
```

## Typed keys

Translation keys are typed end-to-end:

```ts
t('breakdown.create.title')          // ✓ allowed
t('breakdown.foo')                    // ✗ TS error — key doesn't exist
```

## RTL

For RTL locales (`ar`), the `<html dir="rtl">` is set; Tailwind `rtl:` variants flip layouts.

## Offline support

Locale bundles are pre-cached by the service worker so language switching works offline.
