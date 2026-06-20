'use client';

import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import type { PortalNavigation } from '@/modules/dashboard/constants/navigation.types';
import { buildBreadcrumbLabels } from '@/modules/dashboard/constants/navigation.config';
import { useSidebar } from '@/modules/dashboard/hooks/use-sidebar';
import { cn } from '@/lib/utils';
import { AppBreadcrumbs } from '../breadcrumbs/app-breadcrumbs';
import { NotificationDropdown } from './notification-dropdown';
import { ProfileDropdown } from './profile-dropdown';

interface DashboardHeaderProps {
  navigation: PortalNavigation;
  title?: string;
}

export const headerNavButtonClass = cn(
  'text-foreground hover:bg-accent hover:text-foreground',
  'dark:text-white dark:hover:bg-white/10 dark:hover:text-white',
);

export function DashboardHeader({ navigation, title }: DashboardHeaderProps) {
  const { setMobileOpen } = useSidebar();
  const breadcrumbLabels = buildBreadcrumbLabels(navigation);

  return (
    <header
      className={cn(
        'z-30 flex h-14 shrink-0 items-center gap-4 border-b px-4 backdrop-blur-md md:px-6',
        'border-border/60 bg-background/95 text-foreground',
        'dark:border-brand-navy/30 dark:bg-brand-navy dark:text-white',
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        className={cn(headerNavButtonClass, 'md:hidden')}
        onClick={() => setMobileOpen(true)}
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </Button>

      <div
        className={cn(
          'flex min-w-0 flex-1 flex-col gap-0.5',
          'dark:[&_.text-foreground]:text-white dark:[&_.text-muted-foreground]:text-white/70',
          '[&_a:hover]:text-primary',
        )}
      >
        {title && <h1 className="truncate text-lg font-semibold md:hidden">{title}</h1>}
        <AppBreadcrumbs labels={breadcrumbLabels} homeHref={navigation.homeHref} />
      </div>

      <div className="flex items-center gap-1">
        <ThemeToggle className={headerNavButtonClass} />
        <NotificationDropdown triggerClassName={headerNavButtonClass} />
        <ProfileDropdown triggerClassName={headerNavButtonClass} />
      </div>
    </header>
  );
}
