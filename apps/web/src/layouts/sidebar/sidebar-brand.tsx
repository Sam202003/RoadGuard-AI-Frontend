'use client';

import Link from 'next/link';
import { RoadGuardLogo } from '@/components/brand/road-guard-logo';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/modules/dashboard/hooks/use-sidebar';

interface SidebarBrandProps {
  homeHref: string;
}

export function SidebarBrand({ homeHref }: SidebarBrandProps) {
  const { collapsed } = useSidebar();

  return (
    <Link
      href={homeHref}
      className={cn(
        'flex items-center gap-2 rounded-lg px-2 py-2 transition-colors hover:bg-sidebar-accent',
        collapsed && 'justify-center px-0',
      )}
    >
      <RoadGuardLogo size={collapsed ? 'sm' : 'md'} className="shrink-0" />
      {!collapsed && (
        <div className="min-w-0">
          <p className="truncate text-sm font-bold tracking-tight text-sidebar-foreground">
            Road Guard
          </p>
        </div>
      )}
    </Link>
  );
}
