import { BreakdownStatus } from '@/modules/breakdown-requests/constants/breakdown.enums';
import { RequestPriority } from '@/modules/breakdown-requests/constants/breakdown.enums';
import type { BreakdownRequest } from '@/modules/breakdown-requests/types/breakdown.types';
import { PROVIDER_ACTIVE_STATUSES } from '../constants/active-statuses';

export function isActiveProviderRequest(request: BreakdownRequest): boolean {
  return PROVIDER_ACTIVE_STATUSES.includes(request.status);
}

export function isEmergencyRequest(request: BreakdownRequest): boolean {
  return request.priority === RequestPriority.EMERGENCY;
}

export function sortRequestsByPriority(requests: BreakdownRequest[]): BreakdownRequest[] {
  return [...requests].sort((a, b) => {
    const aEmergency = isEmergencyRequest(a) ? 1 : 0;
    const bEmergency = isEmergencyRequest(b) ? 1 : 0;
    if (aEmergency !== bEmergency) return bEmergency - aEmergency;
    return new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime();
  });
}

export function countActiveRequests(requests: BreakdownRequest[]): number {
  return requests.filter(isActiveProviderRequest).length;
}

export function countCompletedInList(requests: BreakdownRequest[]): number {
  return requests.filter((r) => r.status === BreakdownStatus.COMPLETED).length;
}

export function formatShortId(id: string): string {
  return id.slice(-8).toUpperCase();
}
