'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import type { PortalNavigation } from '@/modules/dashboard/constants/navigation.types';
import { useSidebar } from '@/modules/dashboard/hooks/use-sidebar';
import { cn } from '@/lib/utils';
import { SidebarBrand } from './sidebar-brand';
import { SidebarNav } from './sidebar-nav';

interface AppSidebarProps {
  navigation: PortalNavigation;
  className?: string;
  onNavigate?: () => void;
}

export function AppSidebar({ navigation, className, onNavigate }: AppSidebarProps) {
  const { collapsed, toggleCollapsed } = useSidebar();

  return (
    <motion.aside
      layout
      initial={false}
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className={cn(
        'sticky top-0 hidden h-screen shrink-0 flex-col overflow-hidden border-r border-sidebar-border bg-sidebar text-sidebar-foreground backdrop-blur-xl md:flex',
        className,
      )}
    >
      <div className="flex h-14 shrink-0 items-center justify-between px-3">
        <SidebarBrand homeHref={navigation.homeHref} />
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0"
          onClick={toggleCollapsed}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
      <Separator className="shrink-0" />
      <SidebarNav navigation={navigation} onNavigate={onNavigate} />
    </motion.aside>
  );
}
