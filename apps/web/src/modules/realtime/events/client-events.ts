/** Client → Server — mirrors backend ClientEvents */
export const ClientEvents = {
  AUTH_CONNECT: 'auth:connect',
  PROVIDER_LOCATION_UPDATE: 'provider:location:update',
  REQUEST_JOIN: 'request:join',
  REQUEST_LEAVE: 'request:leave',
  PROVIDER_ONLINE: 'provider:online',
  PROVIDER_OFFLINE: 'provider:offline',
  HEARTBEAT: 'heartbeat',
} as const;
