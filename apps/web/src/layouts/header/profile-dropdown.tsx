'use client';

import { useRouter } from 'next/navigation';
import { LogOut, Settings, User } from 'lucide-react';
import { useSelector } from 'react-redux';
import { routes } from '@roadguard/config';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { selectAuthUser } from '@/store/auth.selectors';
import { useLogoutMutation } from '@/store/api/auth.api';
import { cn } from '@/lib/utils';

function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

export function ProfileDropdown({ triggerClassName }: { triggerClassName?: string }) {
  const user = useSelector(selectAuthUser);
  const router = useRouter();
  const [logout, { isLoading }] = useLogoutMutation();

  if (!user) return null;

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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className={cn('relative h-9 w-9 rounded-full', triggerClassName)}>
          <Avatar className="h-9 w-9">
            {user.profileImage && <AvatarImage src={user.profileImage} alt={user.firstName} />}
            <AvatarFallback className="bg-primary/15 text-primary text-xs dark:bg-white/15 dark:text-white">
              {getInitials(user.firstName, user.lastName)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
            <p className="text-xs text-muted-foreground capitalize">{user.role.toLowerCase()}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled className="gap-2 opacity-60">
          <User className="h-4 w-4" />
          Profile
          <span className="ml-auto text-[10px]">Soon</span>
        </DropdownMenuItem>
        <DropdownMenuItem disabled className="gap-2 opacity-60">
          <Settings className="h-4 w-4" />
          Settings
          <span className="ml-auto text-[10px]">Soon</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="gap-2 text-destructive focus:text-destructive"
          onClick={handleLogout}
          disabled={isLoading}
        >
          <LogOut className="h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
