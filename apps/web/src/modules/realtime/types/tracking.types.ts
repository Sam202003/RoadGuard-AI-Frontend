import type { BreakdownStatus } from '@/modules/breakdown-requests/constants/breakdown.enums';
import type { BreakdownRequest } from '@/modules/breakdown-requests/types/breakdown.types';
import type { UserRole } from '@roadguard/types';

export type SocketConnectionState =
  | 'CONNECTING'
  | 'CONNECTED'
  | 'RECONNECTING'
  | 'DISCONNECTED';

export interface GeoPoint {
  type: 'Point';
  coordinates: [number, number];
}

export interface LatLng {
  lat: number;
  lng: number;
}

export interface ProviderLocationUpdatedPayload {
  requestId: string;
  providerId: string;
  location: GeoPoint;
  speed?: number;
  heading?: number;
  distanceKm: number;
  timestamp: string;
}

export interface EtaUpdatedPayload {
  requestId: string;
  providerId: string;
  estimatedArrivalMinutes: number;
  estimatedDistanceKm: number;
  timestamp: string;
}

export interface RequestStatusUpdatedPayload {
  request: BreakdownRequest;
  previousStatus?: BreakdownStatus;
  timestamp: string;
}

export interface ProviderAssignedPayload {
  request: BreakdownRequest;
  providerId: string;
  timestamp: string;
}

export interface RequestCancelledPayload {
  request: BreakdownRequest;
  timestamp: string;
}

export interface AuthConnectedPayload {
  userId: string;
  role: UserRole;
  providerId?: string;
  socketId: string;
  timestamp: string;
}

export interface NotificationNewPayload {
  notification: import('@/modules/notifications/types/notification.types').Notification;
  timestamp: string;
}

export interface NotificationReadPayload {
  notificationId: string;
  userId: string;
  timestamp: string;
}

export interface NotificationCountUpdatePayload {
  userId: string;
  unreadCount: number;
  timestamp: string;
}

export interface LiveTrackingState {
  providerPosition: LatLng | null;
  customerPosition: LatLng | null;
  routePoints: LatLng[];
  estimatedArrivalMinutes: number | null;
  estimatedDistanceKm: number | null;
  lastUpdatedAt: string | null;
}
