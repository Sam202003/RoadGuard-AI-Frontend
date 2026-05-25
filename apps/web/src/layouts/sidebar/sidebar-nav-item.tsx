'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import type { NavItem } from '@/modules/dashboard/constants/navigation.types';
import { useSidebar } from '@/modules/dashboard/hooks/use-sidebar';

interface SidebarNavItemProps {
  item: NavItem;
  active: boolean;
  onNavigate?: () => void;
}

export function SidebarNavItem({ item, active, onNavigate }: SidebarNavItemProps) {
  const { collapsed } = useSidebar();
  const Icon = item.icon;

  const content = (
    <>
      <Icon className="h-4 w-4 shrink-0" />
      {!collapsed && (
        <>
          <span className="flex-1 truncate">{item.label}</span>
          {item.badge && (
            <Badge variant="secondary" className="ml-auto text-[10px] px-1.5 py-0">
              {item.badge}
            </Badge>
          )}
        </>
      )}
    </>
  );

  const className = cn(
    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
    collapsed && 'justify-center px-2',
    active
      ? 'bg-primary/10 text-primary'
      : 'text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground',
    item.disabled && 'pointer-events-none opacity-50',
  );

  if (item.disabled) {
    return <div className={className}>{content}</div>;
  }

  return (
    <Link href={item.href} className={className} onClick={onNavigate}>
      {content}
    </Link>
  );
}
