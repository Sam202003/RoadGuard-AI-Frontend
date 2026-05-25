'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useSelector } from 'react-redux';
import { getAccessToken } from '@/lib/auth-storage';
import { selectIsAuthenticated } from '@/store/auth.selectors';
import { ClientEvents } from '../events/client-events';
import { ServerEvents } from '../events/server-events';
import { connectSocket, disconnectSocket, getSocketInstance } from '../socket/socket-client';
import type { AuthConnectedPayload, SocketConnectionState } from '../types/tracking.types';

interface SocketContextValue {
  socket: ReturnType<typeof getSocketInstance>;
  connectionState: SocketConnectionState;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextValue | null>(null);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [connectionState, setConnectionState] = useState<SocketConnectionState>('DISCONNECTED');
  const [, setTick] = useState(0);

  const bindSocket = useCallback((socket: NonNullable<ReturnType<typeof getSocketInstance>>) => {
    const onConnect = () => {
      setConnectionState('CONNECTED');
      socket.emit(ClientEvents.AUTH_CONNECT, {});
    };
    const onDisconnect = () => setConnectionState('DISCONNECTED');
    const onConnectError = () => setConnectionState('DISCONNECTED');
    const onReconnectAttempt = () => setConnectionState('RECONNECTING');
    const onReconnect = () => {
      setConnectionState('CONNECTED');
      socket.emit(ClientEvents.AUTH_CONNECT, {});
    };
    const onAuthConnected = (_payload: AuthConnectedPayload) => {
      setConnectionState('CONNECTED');
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('connect_error', onConnectError);
    socket.io.on('reconnect_attempt', onReconnectAttempt);
    socket.io.on('reconnect', onReconnect);
    socket.on(ServerEvents.AUTH_CONNECTED, onAuthConnected);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('connect_error', onConnectError);
      socket.io.off('reconnect_attempt', onReconnectAttempt);
      socket.io.off('reconnect', onReconnect);
      socket.off(ServerEvents.AUTH_CONNECTED, onAuthConnected);
    };
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      disconnectSocket();
      setConnectionState('DISCONNECTED');
      return;
    }

    const token = getAccessToken();
    if (!token) {
      setConnectionState('DISCONNECTED');
      return;
    }

    setConnectionState('CONNECTING');
    const socket = connectSocket(token);
    const cleanup = bindSocket(socket);
    setTick((n) => n + 1);

    const heartbeat = setInterval(() => {
      if (socket.connected) {
        socket.emit(ClientEvents.HEARTBEAT, { timestamp: new Date().toISOString() });
      }
    }, 30_000);

    return () => {
      clearInterval(heartbeat);
      cleanup();
    };
  }, [isAuthenticated, bindSocket]);

  const value = useMemo<SocketContextValue>(
    () => ({
      socket: getSocketInstance(),
      connectionState,
      isConnected: connectionState === 'CONNECTED',
    }),
    [connectionState],
  );

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
}

export function useSocketContext(): SocketContextValue {
  const ctx = useContext(SocketContext);
  if (!ctx) {
    throw new Error('useSocketContext must be used within SocketProvider');
  }
  return ctx;
}
