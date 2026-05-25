'use client';

import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import type { PortalNavigation } from '@/modules/dashboard/constants/navigation.types';
import { buildBreadcrumbLabels } from '@/modules/dashboard/constants/navigation.config';
import { useSidebar } from '@/modules/dashboard/hooks/use-sidebar';
import { AppBreadcrumbs } from '../breadcrumbs/app-breadcrumbs';
import { NotificationDropdown } from './notification-dropdown';
import { ProfileDropdown } from './profile-dropdown';

interface DashboardHeaderProps {
  navigation: PortalNavigation;
  title?: string;
}

export function DashboardHeader({ navigation, title }: DashboardHeaderProps) {
  const { setMobileOpen } = useSidebar();
  const breadcrumbLabels = buildBreadcrumbLabels(navigation);

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-4 border-b border-border/60 bg-background/80 px-4 backdrop-blur-md md:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={() => setMobileOpen(true)}
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </Button>

      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        {title && <h1 className="truncate text-lg font-semibold md:hidden">{title}</h1>}
        <AppBreadcrumbs labels={breadcrumbLabels} homeHref={navigation.homeHref} />
      </div>

      <div className="flex items-center gap-1">
        <ThemeToggle />
        <NotificationDropdown />
        <ProfileDropdown />
      </div>
    </header>
  );
}
