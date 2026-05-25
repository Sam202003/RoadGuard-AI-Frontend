import { StatusBadge } from '@/modules/breakdown-requests/components/status-badge';
import { Card } from '@/components/ui/card';
import type { BreakdownStatus } from '@/modules/breakdown-requests/constants/breakdown.enums';

interface TrackingStatusCardProps {
  status: BreakdownStatus;
}

export function TrackingStatusCard({ status }: TrackingStatusCardProps) {
  return (
    <Card className="border-border/60 bg-background/95 px-4 py-3 shadow-lg backdrop-blur">
      <p className="text-xs text-muted-foreground">Request status</p>
      <div className="mt-2">
        <StatusBadge status={status} />
      </div>
    </Card>
  );
}
