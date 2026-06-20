import type { UserRole } from '@roadguard/types';
import type { BreakdownStatus } from '@/modules/breakdown-requests/constants/breakdown.enums';
import type { RequestPriority } from '@/modules/breakdown-requests/constants/breakdown.enums';
import type {
  AvailabilityStatus,
  KycStatus,
  OnlineStatus,
  ProviderType,
} from '@/modules/provider-dashboard/constants/provider.enums';

export interface AdminDashboardStats {
  totalUsers: number;
  totalCustomers: number;
  totalProviders: number;
  activeBreakdownRequests: number;
  completedRequests: number;
  emergencyRequests: number;
  onlineProviders: number;
}

export interface AdminActivityItem {
  id: string;
  type: 'request' | 'user' | 'provider' | 'emergency' | 'system';
  title: string;
  description: string;
  timestamp: string;
}

export interface AdminUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: UserRole;
  profileImage?: string | null;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isActive: boolean;
  lastLoginAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ListAdminUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: UserRole;
}

export interface ListAdminUsersResult {
  users: AdminUser[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AdminProviderRatings {
  average: number;
  count: number;
}

export interface AdminProvider {
  id: string;
  userId: string;
  businessName: string;
  providerType: ProviderType;
  servicesOffered: string[];
  phoneNumber: string;
  email: string;
  profileImage?: string | null;
  currentLocation?: {
    type: 'Point';
    coordinates: [number, number];
  } | null;
  availabilityStatus: AvailabilityStatus;
  onlineStatus: OnlineStatus;
  kycStatus: KycStatus;
  ratings: AdminProviderRatings;
  totalCompletedRequests: number;
  createdAt: string;
  updatedAt: string;
}

export interface ListAdminProvidersParams {
  page?: number;
  limit?: number;
  search?: string;
  availabilityStatus?: AvailabilityStatus;
  onlineStatus?: OnlineStatus;
}

export interface ListAdminProvidersResult {
  providers: AdminProvider[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AdminAnalytics {
  requestsByStatus: Array<{ status: BreakdownStatus; count: number }>;
  requestsPerDay: Array<{ date: string; count: number }>;
  providerActivity: Array<{ providerName: string; completedCount: number }>;
  emergencyRequestCount: number;
}

export interface UpdateUserStatusPayload {
  isActive: boolean;
}

export interface AdminBreakdownListParams {
  page?: number;
  limit?: number;
  status?: BreakdownStatus;
  emergencyOnly?: boolean;
  search?: string;
}

export interface AdminBreakdownRequestSummary {
  id: string;
  customerId: string;
  assignedProviderId?: string | null;
  issueType: string;
  priority: RequestPriority;
  status: BreakdownStatus;
  requestedAt: string;
  isEmergency: boolean;
}
