import type {
  BreakdownStatus,
  IssueType,
  RequestPriority,
} from '../constants/breakdown.enums';

export interface GeoPoint {
  type: 'Point';
  coordinates: [number, number];
}

export interface BreakdownRequest {
  id: string;
  customerId: string;
  vehicleId: string;
  assignedProviderId?: string | null;
  issueType: IssueType;
  issueDescription: string;
  images: string[];
  priority: RequestPriority;
  status: BreakdownStatus;
  location: GeoPoint;
  requestedAt: string;
  assignedAt?: string | null;
  arrivedAt?: string | null;
  completedAt?: string | null;
  cancelledAt?: string | null;
  estimatedArrivalTime?: number | null;
  estimatedDistance?: number | null;
  serviceCost?: number | null;
  cancellationReason?: string | null;
  aiDiagnosisSummary?: string | null;
  notes?: string | null;
  trackingEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ListBreakdownRequestsParams {
  page?: number;
  limit?: number;
  sort?: string;
  search?: string;
  status?: BreakdownStatus;
}

export interface ListBreakdownRequestsResult {
  requests: BreakdownRequest[];
  meta?: Record<string, unknown>;
}

export interface CreateBreakdownRequestPayload {
  vehicleId: string;
  issueType: IssueType;
  issueDescription: string;
  priority?: RequestPriority;
  location: GeoPoint;
  trackingEnabled?: boolean;
  searchRadiusKm?: number;
}

export interface CancelBreakdownRequestPayload {
  cancellationReason: string;
}
