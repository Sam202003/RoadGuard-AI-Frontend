'use client';

import type { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { DashboardContent, DashboardPageHeader } from '@/modules/dashboard';
import { selectAuthUser } from '@/store/auth.selectors';
import { SettingsProfileCard } from '../components/settings-profile-card';
import { SettingsSecurityCard } from '../components/settings-security-card';

interface SettingsPageProps {
  title?: string;
  description?: string;
  children?: ReactNode;
}

export function SettingsPage({
  title = 'Settings',
  description = 'Manage your account profile and security preferences.',
  children,
}: SettingsPageProps) {
  const user = useSelector(selectAuthUser);

  if (!user) {
    return (
      <DashboardContent>
        <p className="text-sm text-muted-foreground">Sign in to view settings.</p>
      </DashboardContent>
    );
  }

  return (
    <DashboardContent>
      <DashboardPageHeader title={title} description={description} />
      <div className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <SettingsProfileCard user={user} />
          <SettingsSecurityCard />
        </div>
        {children}
      </div>
    </DashboardContent>
  );
}
