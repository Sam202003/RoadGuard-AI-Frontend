import { UserRole } from '@roadguard/types';
import { RoleDashboardLayout } from '@/modules/dashboard';

export default function ProviderPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RoleDashboardLayout role={UserRole.PROVIDER}>{children}</RoleDashboardLayout>;
}
