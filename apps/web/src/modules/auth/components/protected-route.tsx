'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { getDashboardPathForRole, routes } from '@roadguard/config';
import { UserRole } from '@roadguard/types';
import { AuthLoadingSpinner } from '@/components/auth-loading-spinner';
import { selectAuthUser, selectIsAuthenticated } from '@/store/auth.selectors';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const router = useRouter();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectAuthUser);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace(routes.auth.login);
      return;
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
      router.replace(getDashboardPathForRole(user.role));
    }
  }, [isAuthenticated, user, allowedRoles, router]);

  if (!isAuthenticated || !user) {
    return <AuthLoadingSpinner />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}
