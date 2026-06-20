'use client';

import { motion } from 'framer-motion';
import type { PortalNavigation } from '@/modules/dashboard/constants/navigation.types';
import { SidebarProvider } from '@/modules/dashboard/hooks/use-sidebar';
import { usePageTitle } from '@/modules/dashboard/hooks/use-page-title';
import { AppSidebar } from '../sidebar/app-sidebar';
import { MobileSidebar } from '../mobile/mobile-sidebar';
import { DashboardHeader } from '../header/dashboard-header';

interface DashboardLayoutProps {
  navigation: PortalNavigation;
  children: React.ReactNode;
}

export function DashboardLayout({ navigation, children }: DashboardLayoutProps) {
  const pageTitle = usePageTitle(navigation);

  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden bg-gradient-to-br from-background via-background to-brand-orange/5">
        <AppSidebar navigation={navigation} />
        <MobileSidebar navigation={navigation} />

        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
          <DashboardHeader navigation={navigation} title={pageTitle} />
          <motion.main
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="min-h-0 flex-1 overflow-y-auto"
          >
            {children}
          </motion.main>
        </div>
      </div>
    </SidebarProvider>
  );
}
