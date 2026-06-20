import { RequestPriority } from '@/modules/breakdown-requests/constants/breakdown.enums';
import type { BreakdownRequest } from '@/modules/breakdown-requests/types/breakdown.types';

export function isEmergencyRequest(request: BreakdownRequest): boolean {
  return request.priority === RequestPriority.EMERGENCY;
}
