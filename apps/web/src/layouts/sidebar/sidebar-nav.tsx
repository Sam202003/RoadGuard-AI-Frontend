'use client';

import { usePathname } from 'next/navigation';
import type { PortalNavigation } from '@/modules/dashboard/constants/navigation.types';
import { SidebarNavItem } from './sidebar-nav-item';
import { useSidebar } from '@/modules/dashboard/hooks/use-sidebar';
import { cn } from '@/lib/utils';

interface SidebarNavProps {
  navigation: PortalNavigation;
  onNavigate?: () => void;
}

export function SidebarNav({ navigation, onNavigate }: SidebarNavProps) {
  const pathname = usePathname();
  const { collapsed } = useSidebar();

  return (
    <nav className="flex flex-1 flex-col gap-4 px-2 py-2">
      {navigation.groups.map((group) => (
        <div key={group.id} className="space-y-1">
          {group.label && !collapsed && (
            <p className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {group.label}
            </p>
          )}
          <div className={cn('space-y-0.5', collapsed && 'space-y-1')}>
            {group.items.map((item) => (
              <SidebarNavItem
                key={item.id}
                item={item}
                active={pathname === item.href || pathname.startsWith(`${item.href}/`)}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        </div>
      ))}
    </nav>
  );
}
