import { BreakdownStatus, RequestPriority } from '../constants/breakdown.enums';

export function getStatusBadgeClass(status: BreakdownStatus): string {
  switch (status) {
    case BreakdownStatus.CREATED:
    case BreakdownStatus.SEARCHING_PROVIDER:
      return 'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400';
    case BreakdownStatus.PROVIDER_ASSIGNED:
    case BreakdownStatus.ON_THE_WAY:
      return 'border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-400';
    case BreakdownStatus.ARRIVED:
    case BreakdownStatus.IN_PROGRESS:
      return 'border-violet-500/30 bg-violet-500/10 text-violet-700 dark:text-violet-400';
    case BreakdownStatus.COMPLETED:
      return 'border-primary/30 bg-primary/10 text-brand-navy dark:text-primary';
    case BreakdownStatus.CANCELLED:
      return 'border-destructive/30 bg-destructive/10 text-destructive';
    default:
      return 'border-border bg-muted text-muted-foreground';
  }
}

export function getPriorityBadgeClass(priority: RequestPriority): string {
  if (priority === RequestPriority.EMERGENCY) {
    return 'border-destructive/40 bg-destructive/15 text-destructive animate-pulse';
  }
  if (priority === RequestPriority.HIGH) {
    return 'border-orange-500/30 bg-orange-500/10 text-orange-700 dark:text-orange-400';
  }
  return 'border-border bg-secondary text-secondary-foreground';
}
