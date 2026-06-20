import { Suspense } from 'react';
import { AuthShell, LoginForm } from '@/modules/auth';

export default function LoginPage() {
  return (
    <AuthShell
      title="Welcome back"
      description="Sign in to your Road Guard account to get roadside assistance."
    >
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
