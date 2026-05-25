import { BreakdownStatus } from '@/modules/breakdown-requests/constants/breakdown.enums';

export const PROVIDER_ACTIVE_STATUSES: BreakdownStatus[] = [
  BreakdownStatus.PROVIDER_ASSIGNED,
  BreakdownStatus.ON_THE_WAY,
  BreakdownStatus.ARRIVED,
  BreakdownStatus.IN_PROGRESS,
];

export const PROVIDER_UPDATABLE_STATUSES: BreakdownStatus[] = [
  BreakdownStatus.ON_THE_WAY,
  BreakdownStatus.ARRIVED,
  BreakdownStatus.IN_PROGRESS,
  BreakdownStatus.COMPLETED,
];
