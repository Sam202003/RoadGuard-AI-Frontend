'use client';

import { SettingsPage } from '@/modules/settings';
import { ProviderAccountCard } from '@/modules/settings/components/provider-account-card';
import { useGetMyProviderQuery } from '@/store/api/provider.api';
import { getErrorMessage } from '@/lib/get-error-message';

export default function Page() {
  const { data: provider, isError, error } = useGetMyProviderQuery();

  return (
    <SettingsPage
      title="Provider settings"
      description="Manage your provider profile, verification, and security."
    >
      {isError && (
        <p className="text-sm text-destructive">
          {getErrorMessage(error, 'Provider profile not found. Complete onboarding first.')}
        </p>
      )}
      {provider && <ProviderAccountCard provider={provider} />}
    </SettingsPage>
  );
}
