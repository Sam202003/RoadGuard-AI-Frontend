# Deployment-Ready Considerations

## Hosting

- **Primary:** Vercel (Next.js native, Edge middleware, instant rollbacks).
- **Alternative:** Self-host on Node 20 with `next start` behind a load balancer.
- **Edge:** Vercel Edge / Cloudflare Workers for `middleware.ts`.

## Environments

| Env | Branch | URL pattern | Data |
|-----|--------|-------------|------|
| Development | feature branches | `*.vercel.app` previews | mock / staging |
| Staging | `staging` | `staging.roadguard.app` | staging |
| Production | `main` | `roadguard.app` | production |

Each environment has its **own** typed env schema in `packages/config/env`.

## CI/CD pipelines (`.github/workflows/`)

| Workflow | Triggers | Steps |
|----------|----------|-------|
| `pr.yml` | PR open / sync | typecheck · lint · unit · contract · build (Turborepo cached) |
| `e2e.yml` | PR with `e2e` label or staging deploy | Playwright across roles |
| `deploy.yml` | push to `main` / `staging` | Vercel deploy → smoke tests → promote |
| `dependency-review.yml` | PRs | SCA scan, license check |
| `lighthouse.yml` | nightly + manual | Lighthouse CI with performance budgets |
| `bundle-analysis.yml` | PRs | Bundle size delta comment |

## PWA

- `app/manifest.ts` — installable app metadata.
- Service worker auto-generated via `next-pwa` or custom Workbox build.
- Install prompt managed by a custom hook (`useInstallPrompt`).

## SEO

- Per-route `metadata.ts` with OG/Twitter/structured-data.
- `app/sitemap.ts` + `app/robots.ts`.
- Per-locale hreflang.
- OG images via `@vercel/og`.

## Observability

- **Sentry** for errors (source maps uploaded in deploy).
- **Web Vitals reporter** posts to backend metrics.
- **OpenTelemetry** correlation IDs across HTTP + sockets.
- **Per-route performance budgets** enforced by Lighthouse CI.

## Rollback

- Vercel deployment URLs are immutable — promote-previous-deployment is the rollback mechanism.
- Self-hosted: blue-green or canary via the load balancer.

## Performance budgets

| Metric | Budget (75th percentile) |
|--------|--------------------------|
| LCP | < 2.5s |
| INP | < 200ms |
| CLS | < 0.1 |
| JS transferred (initial route) | < 200KB gzip |
| TTFB (Edge) | < 200ms |

Pages exceeding budget block PR merge.

## Security headers

- `Content-Security-Policy` with nonces.
- `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`.
- `X-Frame-Options: DENY`.
- `Referrer-Policy: strict-origin-when-cross-origin`.
- `Permissions-Policy` for camera/mic/geo gated to needed routes.

## Secrets management

- Production secrets in Vercel encrypted env vars.
- `OPENAI_API_KEY`, `STRIPE_SECRET_KEY`, `FCM_SERVER_KEY` **never** bundled.
- Only `NEXT_PUBLIC_*` reaches the browser (validated against `ClientEnv`).

## Compliance

- GDPR / DPDP Act ready: data-export and account-delete are first-class flows.
- SOC2 alignment: structured audit logs, role separation, least-privilege admin matrix.
- PCI: payments delegated entirely to Stripe/Razorpay — card data never touches our servers.
