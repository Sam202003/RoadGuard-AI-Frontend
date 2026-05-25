import { AuthShell, RegisterForm } from '@/modules/auth';

export default function RegisterPage() {
  return (
    <AuthShell
      title="Create your account"
      description="Join Road Guard as a customer or service provider."
    >
      <RegisterForm />
    </AuthShell>
  );
}
