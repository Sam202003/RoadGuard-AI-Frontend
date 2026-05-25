'use client';

import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { getErrorMessage } from '@/lib/get-error-message';
import { useUpdateBreakdownStatusMutation } from '@/store/api/breakdown.api';
import type { BreakdownRequest } from '@/modules/breakdown-requests/types/breakdown.types';
import {
  canProviderUpdateStatus,
  getProviderNextStatus,
  getProviderStatusActionLabel,
} from '../utils/status-transitions';

interface StatusUpdateActionsProps {
  request: BreakdownRequest;
  updatingId?: string | null;
  onUpdatingChange?: (id: string | null) => void;
}

export function StatusUpdateActions({
  request,
  updatingId,
  onUpdatingChange,
}: StatusUpdateActionsProps) {
  const [updateStatus, { isLoading }] = useUpdateBreakdownStatusMutation();
  const nextStatus = getProviderNextStatus(request.status);

  if (!canProviderUpdateStatus(request.status) || !nextStatus) {
    return (
      <p className="text-sm text-muted-foreground">
        No further status updates available for this job.
      </p>
    );
  }

  const handleUpdate = async () => {
    onUpdatingChange?.(request.id);
    try {
      await updateStatus({ id: request.id, body: { status: nextStatus } }).unwrap();
      toast.success(`Status updated to ${getProviderStatusActionLabel(nextStatus)}`);
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to update status'));
    } finally {
      onUpdatingChange?.(null);
    }
  };

  const loading = isLoading && updatingId === request.id;

  return (
    <Button onClick={handleUpdate} disabled={loading} className="gap-2">
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {getProviderStatusActionLabel(nextStatus)}
    </Button>
  );
}
