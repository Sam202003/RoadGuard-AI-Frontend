'use client';

import { useEffect } from 'react';
import { useSocketConnection } from '@/modules/realtime';

/** Poll only when realtime socket is disconnected (fallback for stale data). */
export function usePollWhenDisconnected(
  refetch: () => void,
  enabled: boolean,
  intervalMs = 10_000,
): void {
  const { isConnected } = useSocketConnection();

  useEffect(() => {
    if (!enabled || isConnected) return;

    const timer = setInterval(() => {
      void refetch();
    }, intervalMs);

    return () => clearInterval(timer);
  }, [enabled, isConnected, refetch, intervalMs]);
}
