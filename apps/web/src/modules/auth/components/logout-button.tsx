'use client';

import { useRouter } from 'next/navigation';
import { Loader2, LogOut } from 'lucide-react';
import { toast } from 'sonner';
import { routes } from '@roadguard/config';
import { Button } from '@/components/ui/button';
import { useLogoutMutation } from '@/store/api/auth.api';

export function LogoutButton() {
  const router = useRouter();
  const [logout, { isLoading }] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      toast.success('Logged out');
      router.replace(routes.auth.login);
    } catch {
      toast.error('Logout failed');
    }
  };

  return (
    <Button variant="outline" onClick={handleLogout} disabled={isLoading}>
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <LogOut className="h-4 w-4" />
      )}
      Log out
    </Button>
  );
}
