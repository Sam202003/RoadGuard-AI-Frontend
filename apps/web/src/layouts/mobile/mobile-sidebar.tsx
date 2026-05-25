'use client';

import type { PortalNavigation } from '@/modules/dashboard/constants/navigation.types';
import { useSidebar } from '@/modules/dashboard/hooks/use-sidebar';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { SidebarBrand } from '../sidebar/sidebar-brand';
import { SidebarNav } from '../sidebar/sidebar-nav';

interface MobileSidebarProps {
  navigation: PortalNavigation;
}

export function MobileSidebar({ navigation }: MobileSidebarProps) {
  const { mobileOpen, setMobileOpen } = useSidebar();

  return (
    <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
      <SheetContent side="left" className="flex w-[280px] flex-col p-0">
        <div className="px-4 pt-6">
          <SidebarBrand portalName={navigation.portalName} homeHref={navigation.homeHref} />
        </div>
        <Separator className="my-4" />
        <SidebarNav navigation={navigation} onNavigate={() => setMobileOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}
