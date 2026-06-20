'use client';

import { type ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/modules/breakdown-requests/components/status-badge';
import { issueTypeLabels } from '@/modules/breakdown-requests/constants/breakdown-labels';
import type { BreakdownRequest } from '@/modules/breakdown-requests/types/breakdown.types';
import { formatRequestDate } from '@/modules/breakdown-requests/utils/breakdown-formatters';
import { isEmergencyRequest } from '../utils/breakdown-helpers';
import { formatShortId } from '../utils/formatters';

export function useAdminBreakdownColumns(
  onView: (request: BreakdownRequest) => void,
): ColumnDef<BreakdownRequest>[] {
  return [
    {
      accessorKey: 'issueType',
      header: 'Issue',
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{issueTypeLabels[row.original.issueType]}</p>
          {isEmergencyRequest(row.original) && (
            <Badge variant="destructive" className="mt-1">
              Emergency
            </Badge>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      accessorKey: 'assignedProviderId',
      header: 'Provider',
      cell: ({ row }) => (
        <span className="font-mono text-xs text-muted-foreground">
          {row.original.assignedProviderId
            ? formatShortId(row.original.assignedProviderId)
            : 'Unassigned'}
        </span>
      ),
    },
    {
      accessorKey: 'customerId',
      header: 'Customer',
      cell: ({ row }) => (
        <span className="font-mono text-xs text-muted-foreground">
          {formatShortId(row.original.customerId)}
        </span>
      ),
    },
    {
      accessorKey: 'requestedAt',
      header: 'Requested',
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {formatRequestDate(row.original.requestedAt)}
        </span>
      ),
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <div className="flex justify-end">
          <Button variant="ghost" size="sm" onClick={() => onView(row.original)}>
            View
          </Button>
        </div>
      ),
    },
  ];
}
