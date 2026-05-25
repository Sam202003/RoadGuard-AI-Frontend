'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAccessToken } from '@/lib/auth-storage';
import { useLazyGetMeQuery } from '@/store/api/auth.api';
import { logout, setInitialized } from '@/store/auth.slice';
import { selectAuthInitialized } from '@/store/auth.selectors';
import type { AppDispatch } from '@/store';

export function AuthBootstrap({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();
  const initialized = useSelector(selectAuthInitialized);
  const [fetchMe] = useLazyGetMeQuery();

  useEffect(() => {
    const restore = async () => {
      const token = getAccessToken();
      if (!token) {
        dispatch(setInitialized());
        return;
      }

      try {
        await fetchMe().unwrap();
      } catch {
        dispatch(logout());
      }
    };

    if (!initialized) {
      void restore();
    }
  }, [dispatch, fetchMe, initialized]);

  if (!initialized) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return <>{children}</>;
}
