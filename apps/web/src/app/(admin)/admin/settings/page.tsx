'use client';

import { SettingsPage } from '@/modules/settings';
import { AdminPlatformCard } from '@/modules/settings/components/admin-platform-card';

export default function Page() {
  return (
    <SettingsPage
      title="Admin settings"
      description="Platform configuration and administrator account preferences."
    >
      <AdminPlatformCard />
    </SettingsPage>
  );
}
