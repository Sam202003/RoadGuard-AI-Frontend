import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { BreakdownStatus, RequestPriority } from '../constants/breakdown.enums';
import { priorityLabels, statusLabels } from '../constants/breakdown-labels';
import { getPriorityBadgeClass, getStatusBadgeClass } from '../utils/status-styles';

interface StatusBadgeProps {
  status: BreakdownStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <Badge variant="outline" className={cn(getStatusBadgeClass(status), className)}>
      {statusLabels[status]}
    </Badge>
  );
}

interface PriorityBadgeProps {
  priority: RequestPriority;
  className?: string;
}

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  return (
    <Badge variant="outline" className={cn(getPriorityBadgeClass(priority), className)}>
      {priorityLabels[priority]}
    </Badge>
  );
}
