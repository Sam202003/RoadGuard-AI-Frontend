import { UserRole } from '@roadguard/types';
import { RoleDashboardLayout } from '@/modules/dashboard';

export default function CustomerPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RoleDashboardLayout role={UserRole.CUSTOMER}>{children}</RoleDashboardLayout>;
}
