'use client';

import { UserRole } from '@roadguard/types';
import { ProtectedRoute } from '@/modules/auth';
import { getNavigationForRole } from '../constants/navigation.config';
import { DashboardLayout } from '@/layouts/dashboard/dashboard-layout';

interface RoleDashboardLayoutProps {
  role: UserRole;
  children: React.ReactNode;
}

export function RoleDashboardLayout({ role, children }: RoleDashboardLayoutProps) {
  const navigation = getNavigationForRole(role);

  return (
    <ProtectedRoute allowedRoles={[role]}>
      <DashboardLayout navigation={navigation}>{children}</DashboardLayout>
    </ProtectedRoute>
  );
}
