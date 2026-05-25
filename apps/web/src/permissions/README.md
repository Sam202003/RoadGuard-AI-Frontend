# src/permissions — RBAC + ABAC

| File / Folder | Purpose |
|---------------|---------|
| `matrix.ts` | Role × Action × Resource matrix (declarative truth) |
| `guards/` | `withRole`, `withPermission`, `RouteGuard` wrappers |
| `policies/` | Higher-order policies — "can edit own only", "active membership required" |
| `hooks/` | `useCan(action, resource, ctx?)`, `useRole()`, `useIsAdmin()` |

## Roles

- `customer` — End user
- `provider` — Service provider / mechanic
- `admin` — Internal admin
- `super_admin` — Privileged admin (e.g., billing, system settings)
- `support` — Customer support agent (read-only on most resources)

## Pattern

```ts
useCan('breakdown.cancel', { breakdownId })
   ↓
matrix lookup (role allowed?) → false → DENY
   ↓
policy run (e.g., is requester owner?) → false → DENY
   ↓
allowed → ALLOW
```

## Rules

- **Never** check `user.role === 'admin'` inline. Always use `useCan` or `RoleGuard`.
- The same matrix is consumed by **Edge middleware**, **server components**, and **client components** — single source of truth.
