'use client';

import { useRouter } from 'next/navigation';
import { getDashboardPathForRole } from '@roadguard/config';
import type { UserRole } from '@roadguard/types';

export function useAuthRedirect() {
  const router = useRouter();

  return (role: UserRole) => {
    router.replace(getDashboardPathForRole(role));
  };
}
