'use client';

import { formatUnreadBadge } from '@/modules/notifications';
import type { NavItem } from '@/modules/dashboard/constants/navigation.types';
import { useSidebar } from '@/modules/dashboard/hooks/use-sidebar';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface SidebarNavItemProps {
  item: NavItem;
  active: boolean;
  onNavigate?: () => void;
  unreadCount?: number;
}

export function SidebarNavItem({ item, active, onNavigate, unreadCount }: SidebarNavItemProps) {
  const { collapsed } = useSidebar();
  const Icon = item.icon;
  const showUnreadBadge = item.id === 'notifications' && (unreadCount ?? 0) > 0;

  const content = (
    <>
      <div className="relative shrink-0">
        <Icon className="h-4 w-4" />
        {collapsed && showUnreadBadge && (
          <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-destructive" />
        )}
      </div>
      {!collapsed && (
        <>
          <span className="flex-1 truncate">{item.label}</span>
          {showUnreadBadge ? (
            <Badge variant="destructive" className="ml-auto text-[10px] px-1.5 py-0">
              {formatUnreadBadge(unreadCount ?? 0)}
            </Badge>
          ) : (
            item.badge && (
              <Badge variant="secondary" className="ml-auto text-[10px] px-1.5 py-0">
                {item.badge}
              </Badge>
            )
          )}
        </>
      )}
    </>
  );

  const className = cn(
    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
    collapsed && 'justify-center px-2',
    active
      ? 'border-l-2 border-primary bg-primary/15 text-primary'
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
