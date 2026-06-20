'use client';

import { useMemo, useState } from 'react';
import { UserRole } from '@roadguard/types';
import { Search } from 'lucide-react';
import { DashboardContent, DashboardPageHeader } from '@/modules/dashboard';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { getErrorMessage } from '@/lib/get-error-message';
import { toast } from 'sonner';
import { useListAdminUsersQuery, useUpdateAdminUserStatusMutation } from '../api';
import { DataTable } from '../components/data-table';
import { UserDetailSheet } from '../components/user-detail-sheet';
import { roleLabels } from '../constants/admin-labels';
import { useAdminUserColumns } from '../hooks/use-admin-user-columns';
import type { AdminUser } from '../types/admin.types';

export function AdminUsersPage() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'ALL'>('ALL');
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

  const queryArg = useMemo(
    () => ({
      page: 1,
      limit: 50,
      search: search.trim() || undefined,
      role: roleFilter === 'ALL' ? undefined : roleFilter,
    }),
    [search, roleFilter],
  );

  const { data, isLoading, isError, error, refetch } = useListAdminUsersQuery(queryArg);
  const [updateStatus] = useUpdateAdminUserStatusMutation();

  const handleToggleActive = async (user: AdminUser) => {
    try {
      await updateStatus({ id: user.id, body: { isActive: !user.isActive } }).unwrap();
      toast.success(user.isActive ? 'Account disabled' : 'Account enabled');
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to update account status'));
    }
  };

  const columns = useAdminUserColumns(setSelectedUser, handleToggleActive);

  return (
    <DashboardContent>
      <DashboardPageHeader
        title="User management"
        description="Search, filter, and manage customer and provider accounts."
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select
          value={roleFilter}
          onValueChange={(v) => setRoleFilter(v as UserRole | 'ALL')}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All roles</SelectItem>
            {Object.values(UserRole).map((role) => (
              <SelectItem key={role} value={role}>
                {roleLabels[role]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isError && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm">
          <p className="font-medium text-destructive">Failed to load users</p>
          <p className="mt-1 text-muted-foreground">
            {getErrorMessage(error, 'Something went wrong')}
          </p>
          <Button variant="outline" size="sm" className="mt-3" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      )}

      <DataTable
        columns={columns}
        data={data?.users ?? []}
        isLoading={isLoading}
        emptyMessage="No users match your filters."
        onRowClick={setSelectedUser}
      />

      <UserDetailSheet
        user={selectedUser}
        open={!!selectedUser}
        onOpenChange={(open) => !open && setSelectedUser(null)}
      />
    </DashboardContent>
  );
}
