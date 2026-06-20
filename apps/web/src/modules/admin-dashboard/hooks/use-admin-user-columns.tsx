'use client';

import { type ColumnDef } from '@tanstack/react-table';
import { UserRole } from '@roadguard/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { AdminUser } from '../types/admin.types';
import { roleLabels } from '../constants/admin-labels';
import { formatAdminDate } from '../utils/formatters';

export function useAdminUserColumns(
  onView: (user: AdminUser) => void,
  onToggleActive: (user: AdminUser) => void,
): ColumnDef<AdminUser>[] {
  return [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => (
        <div>
          <p className="font-medium">
            {row.original.firstName} {row.original.lastName}
          </p>
          <p className="text-xs text-muted-foreground">{row.original.email}</p>
        </div>
      ),
    },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: ({ row }) => <Badge variant="secondary">{roleLabels[row.original.role]}</Badge>,
    },
    {
      accessorKey: 'isActive',
      header: 'Status',
      cell: ({ row }) => (
        <Badge variant={row.original.isActive ? 'default' : 'destructive'}>
          {row.original.isActive ? 'Active' : 'Disabled'}
        </Badge>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Joined',
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {formatAdminDate(row.original.createdAt)}
        </span>
      ),
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => onView(user)}>
              View
            </Button>
            {user.role !== UserRole.ADMIN && (
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleActive(user);
                }}
              >
                {user.isActive ? 'Disable' : 'Enable'}
              </Button>
            )}
          </div>
        );
      },
    },
  ];
}
