import {
  AvailabilityStatus,
  OnlineStatus,
  ProviderType,
} from './provider.enums';

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
