'use client';

import Link from 'next/link';
import { Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/modules/dashboard/hooks/use-sidebar';

interface SidebarBrandProps {
  portalName: string;
  homeHref: string;
}

export function SidebarBrand({ portalName, homeHref }: SidebarBrandProps) {
  const { collapsed } = useSidebar();

  return (
    <Link
      href={homeHref}
      className={cn(
        'flex items-center gap-2 rounded-lg px-2 py-2 transition-colors hover:bg-sidebar-accent',
        collapsed && 'justify-center px-0',
      )}
    >
      <Shield className="h-7 w-7 shrink-0 text-primary" />
      {!collapsed && (
        <div className="min-w-0">
          <p className="truncate text-sm font-bold tracking-tight">Road Guard</p>
          <p className="truncate text-xs text-muted-foreground">{portalName}</p>
        </div>
      )}
    </Link>
  );
}
