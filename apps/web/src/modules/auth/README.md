# modules/auth — Authentication Module

Login, register, OTP verification, password reset, session.

## Folder Shape

Standard module shape (see `src/modules/README.md`). Key files:

```
auth/
├── components/
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── OTPVerifyPage.tsx
│   ├── ForgotPasswordPage.tsx
│   ├── ResetPasswordPage.tsx
│   ├── OTPInput.tsx
│   ├── SocialLoginButtons.tsx
│   └── AuthLayoutCard.tsx
├── hooks/
│   ├── useLogin.ts
│   ├── useRegister.ts
│   ├── useOTP.ts
│   ├── useSession.ts                   Re-exports from @rg/hooks/auth
│   ├── useLogout.ts
│   └── usePasswordReset.ts
├── services/
│   └── auth.service.ts                 Token management + side effects
├── store/
│   ├── auth.slice.ts                   user, tokens, status
│   ├── auth.selectors.ts
│   └── auth.listeners.ts               On login → bootstrap app
├── forms/
│   ├── login.form.ts
│   ├── register.form.ts
│   └── reset-password.form.ts
├── validations/
│   └── auth.schema.ts                  Zod
├── constants/
│   └── storage-keys.ts
└── index.ts
```

## Cross-cutting impact

`auth/store/auth.listeners.ts` listens to `login.fulfilled` and:

1. Persists tokens via `services/storage` → through the `TokenStore` port.
2. Boots the socket connection.
3. Prefetches dashboard data via RTK Query.
4. Emits an analytics event.
5. Sets the user in Sentry.

These side effects live in **one place** (the listener) — not scattered across components.
