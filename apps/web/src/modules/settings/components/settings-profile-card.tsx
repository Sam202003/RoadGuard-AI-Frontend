'use client';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import type { AuthUser } from '@roadguard/types';
import { formatVerificationStatus } from '../utils/format-verification';

interface SettingsProfileCardProps {
  user: AuthUser;
}

export function SettingsProfileCard({ user }: SettingsProfileCardProps) {
  return (
    <Card className="border-border/60 bg-card/70 p-6">
      <h2 className="text-lg font-semibold">Profile</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Account information associated with your Road Guard login.
      </p>

      <dl className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Name</dt>
          <dd className="mt-1 font-medium">
            {user.firstName} {user.lastName}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Role</dt>
          <dd className="mt-1">
            <Badge variant="secondary">{user.role}</Badge>
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Email</dt>
          <dd className="mt-1 break-all">{user.email}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Phone</dt>
          <dd className="mt-1">{user.phoneNumber}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Email status</dt>
          <dd className="mt-1">{formatVerificationStatus(user.isEmailVerified)}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Phone status</dt>
          <dd className="mt-1">{formatVerificationStatus(user.isPhoneVerified)}</dd>
        </div>
      </dl>
    </Card>
  );
}
