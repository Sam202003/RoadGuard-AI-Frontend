/** Server → Client — mirrors backend ServerEvents */
export const ServerEvents = {
  REQUEST_STATUS_UPDATED: 'request:status:updated',
  PROVIDER_LOCATION_UPDATED: 'provider:location:updated',
  TRACKING_ETA_UPDATED: 'tracking:eta:updated',
  PROVIDER_ASSIGNED: 'provider:assigned',
  PROVIDER_ONLINE_STATUS: 'provider:online:status',
  REQUEST_CANCELLED: 'request:cancelled',
  REQUEST_CREATED: 'request:created',
  ERROR: 'error:event',
  AUTH_CONNECTED: 'auth:connected',
  HEARTBEAT_ACK: 'heartbeat:ack',
  NOTIFICATION_NEW: 'notification:new',
  NOTIFICATION_READ: 'notification:read',
  NOTIFICATION_COUNT_UPDATE: 'notification:count:update',
} as const;
