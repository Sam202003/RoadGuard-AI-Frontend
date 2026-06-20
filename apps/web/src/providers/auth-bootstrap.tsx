'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AuthLoadingSpinner } from '@/components/auth-loading-spinner';
import { getAccessToken } from '@/lib/auth-storage';
import { registerTokenSyncHandler, registerSocketReconnectHandler } from '@/lib/token-refresh-sync';
import { reconnectSocketWithToken } from '@/modules/realtime/socket/socket-client';
import { useLazyGetMeQuery } from '@/store/api/auth.api';
import { logout, setInitialized, updateTokens } from '@/store/auth.slice';
import { selectAuthInitialized } from '@/store/auth.selectors';
import type { AppDispatch } from '@/store';

export function AuthBootstrap({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();
  const initialized = useSelector(selectAuthInitialized);
  const [fetchMe] = useLazyGetMeQuery();

  useEffect(() => {
    registerTokenSyncHandler((tokens) => {
      dispatch(updateTokens(tokens));
    });
    registerSocketReconnectHandler(reconnectSocketWithToken);
  }, [dispatch]);

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
    return <AuthLoadingSpinner />;
  }

  return <>{children}</>;
}
