'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import { routes } from '@roadguard/config';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { getErrorMessage } from '@/lib/get-error-message';
import { logoutRequest } from '@/modules/auth/services/auth.service';
import { logout } from '@/store/auth.slice';
import type { AppDispatch } from '@/store';

export function SettingsSecurityCard() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logoutRequest();
    } catch (err) {
      toast.error(getErrorMessage(err, 'Logout failed'));
    } finally {
      dispatch(logout());
      router.push(routes.auth.login);
    }
  };

  return (
    <Card className="border-border/60 bg-card/70 p-6">
      <h2 className="text-lg font-semibold">Security</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Manage your session and sign out from this device.
      </p>
      <Button variant="outline" className="mt-4" onClick={handleLogout}>
        Sign out
      </Button>
    </Card>
  );
}
