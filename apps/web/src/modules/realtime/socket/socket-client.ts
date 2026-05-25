import { io, type Socket } from 'socket.io-client';
import { getSocketBaseUrl, getSocketPath } from '@roadguard/config';

let socketInstance: Socket | null = null;

export function getSocketInstance(): Socket | null {
  return socketInstance;
}

export function connectSocket(token: string): Socket {
  if (socketInstance?.connected) {
    return socketInstance;
  }

  if (socketInstance) {
    socketInstance.removeAllListeners();
    socketInstance.disconnect();
  }

  socketInstance = io(getSocketBaseUrl(), {
    path: getSocketPath(),
    auth: { token },
    transports: ['websocket', 'polling'],
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 15,
    reconnectionDelay: 2000,
    reconnectionDelayMax: 10000,
  });

  return socketInstance;
}

export function disconnectSocket(): void {
  if (socketInstance) {
    socketInstance.removeAllListeners();
    socketInstance.disconnect();
    socketInstance = null;
  }
}
