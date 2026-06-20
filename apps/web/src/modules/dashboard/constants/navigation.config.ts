import {
  BarChart3,
  Bell,
  Bot,
  Car,
  ClipboardList,
  Gauge,
  LayoutDashboard,
  MapPin,
  Settings,
  Users,
  Wallet,
  Wrench,
} from 'lucide-react';
import { UserRole } from '@roadguard/types';
import { routes } from '@roadguard/config';
import type { PortalNavigation } from './navigation.types';

export const customerNavigation: PortalNavigation = {
  portalName: 'Customer',
  homeHref: routes.customer.dashboard,
  groups: [
    {
      id: 'main',
      label: 'Main',
      items: [
        {
          id: 'dashboard',
          label: 'Dashboard',
          href: routes.customer.dashboard,
          icon: LayoutDashboard,
        },
        {
          id: 'vehicles',
          label: 'My Vehicles',
          href: routes.customer.vehicles,
          icon: Car,
        },
        {
          id: 'breakdown',
          label: 'Breakdown',
          href: routes.customer.breakdown,
          icon: Wrench,
        },
        {
          id: 'tracking',
          label: 'Live Tracking',
          href: routes.customer.tracking,
          icon: MapPin,
        },
        {
          id: 'ai-assistant',
          label: 'AI Assistant',
          href: routes.customer.aiAssistant,
          icon: Bot,
        },
      ],
    },
    {
      id: 'account',
      label: 'Account',
      items: [
        {
          id: 'notifications',
          label: 'Notifications',
          href: routes.customer.notifications,
          icon: Bell,
        },
        {
          id: 'settings',
          label: 'Settings',
          href: routes.customer.settings,
          icon: Settings,
        },
      ],
    },
  ],
};

export const providerNavigation: PortalNavigation = {
  portalName: 'Provider',
  homeHref: routes.provider.dashboard,
  groups: [
    {
      id: 'main',
      label: 'Operations',
      items: [
        {
          id: 'dashboard',
          label: 'Dashboard',
          href: routes.provider.dashboard,
          icon: LayoutDashboard,
        },
        {
          id: 'requests',
          label: 'Requests',
          href: routes.provider.requests,
          icon: ClipboardList,
        },
        {
          id: 'tracking',
          label: 'Live Tracking',
          href: routes.provider.tracking,
          icon: MapPin,
        },
        {
          id: 'availability',
          label: 'Availability',
          href: routes.provider.availability,
          icon: Gauge,
        },
        {
          id: 'earnings',
          label: 'Earnings',
          href: routes.provider.earnings,
          icon: Wallet,
        },
      ],
    },
    {
      id: 'account',
      label: 'Account',
      items: [
        {
          id: 'notifications',
          label: 'Notifications',
          href: routes.provider.notifications,
          icon: Bell,
        },
        {
          id: 'settings',
          label: 'Settings',
          href: routes.provider.settings,
          icon: Settings,
        },
      ],
    },
  ],
};

export const adminNavigation: PortalNavigation = {
  portalName: 'Admin',
  homeHref: routes.admin.dashboard,
  groups: [
    {
      id: 'main',
      label: 'Overview',
      items: [
        {
          id: 'dashboard',
          label: 'Dashboard',
          href: routes.admin.dashboard,
          icon: LayoutDashboard,
        },
        {
          id: 'users',
          label: 'Users',
          href: routes.admin.users,
          icon: Users,
        },
        {
          id: 'providers',
          label: 'Providers',
          href: routes.admin.providers,
          icon: Wrench,
        },
        {
          id: 'breakdown',
          label: 'Breakdown',
          href: routes.admin.breakdownRequests,
          icon: ClipboardList,
        },
        {
          id: 'analytics',
          label: 'Analytics',
          href: routes.admin.analytics,
          icon: BarChart3,
        },
      ],
    },
    {
      id: 'system',
      label: 'System',
      items: [
        {
          id: 'notifications',
          label: 'Notifications',
          href: routes.admin.notifications,
          icon: Bell,
        },
        {
          id: 'settings',
          label: 'Settings',
          href: routes.admin.settings,
          icon: Settings,
        },
      ],
    },
  ],
};

export function getNavigationForRole(role: UserRole): PortalNavigation {
  switch (role) {
    case UserRole.CUSTOMER:
      return customerNavigation;
    case UserRole.PROVIDER:
      return providerNavigation;
    case UserRole.ADMIN:
      return adminNavigation;
    default:
      return customerNavigation;
  }
}

const customerVehicleBreadcrumbs: Record<string, string> = {
  [routes.customer.vehicles]: 'My Vehicles',
  [routes.customer.vehiclesAdd]: 'Add Vehicle',
};

const customerBreakdownBreadcrumbs: Record<string, string> = {
  [routes.customer.breakdown]: 'Breakdown',
  [routes.customer.breakdownNew]: 'New Request',
  [routes.customer.aiAssistant]: 'AI Assistant',
};

const providerBreadcrumbs: Record<string, string> = {
  [routes.provider.requests]: 'Requests',
};

/** Flat map of href → label for breadcrumbs */
export function buildBreadcrumbLabels(nav: PortalNavigation): Record<string, string> {
  const labels: Record<string, string> = {
    [nav.homeHref]: 'Dashboard',
  };
  for (const group of nav.groups) {
    for (const item of group.items) {
      labels[item.href] = item.label;
    }
  }
  if (nav.portalName === 'Customer') {
    Object.assign(labels, customerVehicleBreadcrumbs, customerBreakdownBreadcrumbs, {
      [routes.customer.tracking]: 'Live Tracking',
      [routes.customer.settings]: 'Settings',
    });
  }
  if (nav.portalName === 'Provider') {
    Object.assign(labels, providerBreadcrumbs, {
      [routes.provider.tracking]: 'Live Tracking',
      [routes.provider.availability]: 'Availability',
      [routes.provider.earnings]: 'Earnings',
      [routes.provider.settings]: 'Settings',
    });
  }
  if (nav.portalName === 'Admin') {
    Object.assign(labels, {
      [routes.admin.users]: 'Users',
      [routes.admin.providers]: 'Providers',
      [routes.admin.breakdownRequests]: 'Breakdown',
      [routes.admin.analytics]: 'Analytics',
      [routes.admin.settings]: 'Settings',
    });
  }
  return labels;
}
