'use client';

import { UserRole } from '@roadguard/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useUpdateAdminUserStatusMutation } from '../api';
import type { AdminUser } from '../types/admin.types';
import { roleLabels } from '../constants/admin-labels';
import { formatAdminDate } from '../utils/formatters';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/get-error-message';

interface UserDetailSheetProps {
  user: AdminUser | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserDetailSheet({ user, open, onOpenChange }: UserDetailSheetProps) {
  const [updateStatus, { isLoading }] = useUpdateAdminUserStatusMutation();

  if (!user) return null;

  const handleToggleActive = async () => {
    try {
      await updateStatus({ id: user.id, body: { isActive: !user.isActive } }).unwrap();
      toast.success(user.isActive ? 'Account disabled' : 'Account enabled');
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to update account status'));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {user.firstName} {user.lastName}
          </DialogTitle>
          <DialogDescription>{user.email}</DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{roleLabels[user.role]}</Badge>
            <Badge variant={user.isActive ? 'default' : 'destructive'}>
              {user.isActive ? 'Active' : 'Disabled'}
            </Badge>
            {user.isEmailVerified && <Badge variant="outline">Email verified</Badge>}
            {user.isPhoneVerified && <Badge variant="outline">Phone verified</Badge>}
          </div>

          <Separator />

          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-muted-foreground">Phone</dt>
              <dd>{user.phoneNumber}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Role</dt>
              <dd>{roleLabels[user.role]}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Joined</dt>
              <dd>{formatAdminDate(user.createdAt)}</dd>
            </div>
            {user.lastLoginAt && (
              <div>
                <dt className="text-muted-foreground">Last login</dt>
                <dd>{formatAdminDate(user.lastLoginAt)}</dd>
              </div>
            )}
          </dl>

          {user.role !== UserRole.ADMIN && (
            <>
              <Separator />
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium">Account access</p>
                  <p className="text-xs text-muted-foreground">
                    {user.isActive
                      ? 'Disable to prevent this user from signing in.'
                      : 'Re-enable to restore sign-in access.'}
                  </p>
                </div>
                <Button
                  variant={user.isActive ? 'destructive' : 'default'}
                  size="sm"
                  disabled={isLoading}
                  onClick={handleToggleActive}
                >
                  {user.isActive ? 'Disable account' : 'Enable account'}
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
