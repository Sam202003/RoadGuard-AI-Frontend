import type {
  AvailabilityStatus,
  KycStatus,
  OnlineStatus,
  ProviderType,
} from '../constants/provider.enums';

export interface GeoPoint {
  type: 'Point';
  coordinates: [number, number];
}

export interface ProviderRatings {
  average: number;
  count: number;
}

export interface ProviderVehicleDetails {
  type?: string;
  brand?: string;
  model?: string;
  registrationNumber?: string;
}

export interface ProviderProfile {
  id: string;
  userId: string;
  businessName: string;
  providerType: ProviderType;
  servicesOffered: string[];
  phoneNumber: string;
  alternatePhoneNumber?: string | null;
  email: string;
  profileImage?: string | null;
  currentLocation?: GeoPoint | null;
  serviceRadius: number;
  availabilityStatus: AvailabilityStatus;
  onlineStatus: OnlineStatus;
  kycStatus: KycStatus;
  ratings: ProviderRatings;
  totalCompletedRequests: number;
  vehicleDetails?: ProviderVehicleDetails | null;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateAvailabilityPayload {
  availabilityStatus?: AvailabilityStatus;
  onlineStatus?: OnlineStatus;
}

export interface UpdateLocationPayload {
  currentLocation: GeoPoint;
  serviceRadius?: number;
}
