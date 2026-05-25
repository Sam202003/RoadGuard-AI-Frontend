import { BreakdownStatus } from '@/modules/breakdown-requests/constants/breakdown.enums';
import { statusLabels } from '@/modules/breakdown-requests/constants/breakdown-labels';

const PROVIDER_NEXT_STATUS: Partial<Record<BreakdownStatus, BreakdownStatus>> = {
  [BreakdownStatus.PROVIDER_ASSIGNED]: BreakdownStatus.ON_THE_WAY,
  [BreakdownStatus.ON_THE_WAY]: BreakdownStatus.ARRIVED,
  [BreakdownStatus.ARRIVED]: BreakdownStatus.IN_PROGRESS,
  [BreakdownStatus.IN_PROGRESS]: BreakdownStatus.COMPLETED,
};

export function getProviderNextStatus(current: BreakdownStatus): BreakdownStatus | null {
  return PROVIDER_NEXT_STATUS[current] ?? null;
}

export function canProviderUpdateStatus(current: BreakdownStatus): boolean {
  return getProviderNextStatus(current) !== null;
}

export function getProviderStatusActionLabel(nextStatus: BreakdownStatus): string {
  switch (nextStatus) {
    case BreakdownStatus.ON_THE_WAY:
      return 'Mark on the way';
    case BreakdownStatus.ARRIVED:
      return 'Mark arrived';
    case BreakdownStatus.IN_PROGRESS:
      return 'Start service';
    case BreakdownStatus.COMPLETED:
      return 'Complete job';
    default:
      return `Update to ${statusLabels[nextStatus]}`;
  }
}
