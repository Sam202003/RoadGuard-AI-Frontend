import { UserRole } from '@roadguard/types';
import {
  AvailabilityStatus,
  OnlineStatus,
  ProviderType,
} from '@/modules/provider-dashboard/constants/provider.enums';

export const roleLabels: Record<UserRole, string> = {
  [UserRole.CUSTOMER]: 'Customer',
  [UserRole.PROVIDER]: 'Provider',
  [UserRole.ADMIN]: 'Admin',
};

export const providerTypeLabels: Record<ProviderType, string> = {
  [ProviderType.MECHANIC]: 'Mechanic',
  [ProviderType.TOWING]: 'Towing',
  [ProviderType.FUEL_DELIVERY]: 'Fuel delivery',
  [ProviderType.BATTERY_SUPPORT]: 'Battery support',
  [ProviderType.EV_SUPPORT]: 'EV support',
};

export const availabilityLabels: Record<AvailabilityStatus, string> = {
  [AvailabilityStatus.AVAILABLE]: 'Available',
  [AvailabilityStatus.BUSY]: 'Busy',
  [AvailabilityStatus.OFFLINE]: 'Offline',
};

export const onlineStatusLabels: Record<OnlineStatus, string> = {
  [OnlineStatus.ONLINE]: 'Online',
  [OnlineStatus.OFFLINE]: 'Offline',
};
