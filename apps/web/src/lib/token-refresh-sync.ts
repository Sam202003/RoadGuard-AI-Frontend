import type { AuthTokens } from '@roadguard/types';

type TokenSyncHandler = (tokens: AuthTokens) => void;
type SocketReconnectHandler = (accessToken: string) => void;

let handler: TokenSyncHandler | null = null;
let socketReconnectHandler: SocketReconnectHandler | null = null;

export function registerTokenSyncHandler(next: TokenSyncHandler): void {
  handler = next;
}

export function registerSocketReconnectHandler(next: SocketReconnectHandler): void {
  socketReconnectHandler = next;
}

export function notifyTokensRefreshed(tokens: AuthTokens): void {
  handler?.(tokens);
  socketReconnectHandler?.(tokens.accessToken);
}
