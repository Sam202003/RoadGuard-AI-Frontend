import { UserRole } from '@roadguard/types';
import { RoleDashboardLayout } from '@/modules/dashboard';

export default function AdminPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RoleDashboardLayout role={UserRole.ADMIN}>{children}</RoleDashboardLayout>;
}
