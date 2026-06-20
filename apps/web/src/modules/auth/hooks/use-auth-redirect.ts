'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import {
  getDashboardPathForRole,
  isRedirectPathAllowedForRole,
} from '@roadguard/config';
import type { UserRole } from '@roadguard/types';

export function useAuthRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  return (role: UserRole) => {
    const redirect = searchParams.get('redirect');

    if (redirect && isRedirectPathAllowedForRole(redirect, role)) {
      router.replace(redirect);
      return;
    }

    router.replace(getDashboardPathForRole(role));
  };
}
