'use client';

import { type ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { AdminProvider } from '../types/admin.types';
import {
  availabilityLabels,
  onlineStatusLabels,
  providerTypeLabels,
} from '../constants/admin-labels';
import { formatCoordinates, formatRating } from '../utils/formatters';

export function useAdminProviderColumns(
  onView: (provider: AdminProvider) => void,
): ColumnDef<AdminProvider>[] {
  return [
    {
      accessorKey: 'businessName',
      header: 'Provider',
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{row.original.businessName}</p>
          <p className="text-xs text-muted-foreground">{row.original.email}</p>
        </div>
      ),
    },
    {
      accessorKey: 'providerType',
      header: 'Type',
      cell: ({ row }) => (
        <Badge variant="outline">{providerTypeLabels[row.original.providerType]}</Badge>
      ),
    },
    {
      accessorKey: 'availabilityStatus',
      header: 'Availability',
      cell: ({ row }) => (
        <Badge variant="secondary">
          {availabilityLabels[row.original.availabilityStatus]}
        </Badge>
      ),
    },
    {
      accessorKey: 'onlineStatus',
      header: 'Online',
      cell: ({ row }) => (
        <Badge variant={row.original.onlineStatus === 'ONLINE' ? 'default' : 'outline'}>
          {onlineStatusLabels[row.original.onlineStatus]}
        </Badge>
      ),
    },
    {
      accessorKey: 'ratings',
      header: 'Rating',
      cell: ({ row }) => (
        <span className="text-sm">
          {formatRating(row.original.ratings.average, row.original.ratings.count)}
        </span>
      ),
    },
    {
      accessorKey: 'currentLocation',
      header: 'Location',
      cell: ({ row }) => (
        <span className="font-mono text-xs text-muted-foreground">
          {formatCoordinates(row.original.currentLocation)}
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
