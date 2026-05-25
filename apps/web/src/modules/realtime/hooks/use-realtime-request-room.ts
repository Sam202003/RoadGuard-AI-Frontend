'use client';

import { useEffect, useRef } from 'react';
import { ClientEvents } from '../events/client-events';
import { useSocketConnection } from './use-socket-connection';

/**
 * Joins a breakdown request room for live events; re-joins after reconnect.
 */
export function useRealtimeRequestRoom(requestId: string | undefined, enabled = true) {
  const { socket, isConnected } = useSocketConnection();
  const joinedRef = useRef<string | null>(null);

  useEffect(() => {
    if (!enabled || !requestId || !socket || !isConnected) return;

    if (joinedRef.current && joinedRef.current !== requestId) {
      socket.emit(ClientEvents.REQUEST_LEAVE, { requestId: joinedRef.current });
    }

    socket.emit(ClientEvents.REQUEST_JOIN, { requestId });
    joinedRef.current = requestId;

    const onReconnect = () => {
      socket.emit(ClientEvents.REQUEST_JOIN, { requestId });
    };
    socket.io.on('reconnect', onReconnect);

    return () => {
      socket.io.off('reconnect', onReconnect);
      socket.emit(ClientEvents.REQUEST_LEAVE, { requestId });
      if (joinedRef.current === requestId) joinedRef.current = null;
    };
  }, [enabled, requestId, socket, isConnected]);
}
