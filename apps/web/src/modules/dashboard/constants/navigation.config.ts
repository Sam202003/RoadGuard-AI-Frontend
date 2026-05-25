import {
  Bell,
  Car,
  ClipboardList,
  Gauge,
  LayoutDashboard,
  MapPin,
  Settings,
  Users,
  Wrench,
  Wallet,
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
          href: routes.customer.breakdown,
          icon: MapPin,
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
          disabled: true,
          badge: 'Soon',
        },
        {
          id: 'settings',
          label: 'Settings',
          href: routes.customer.settings,
          icon: Settings,
          disabled: true,
          badge: 'Soon',
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
          id: 'availability',
          label: 'Availability',
          href: routes.provider.dashboard,
          icon: Gauge,
        },
        {
          id: 'earnings',
          label: 'Earnings',
          href: routes.provider.earnings,
          icon: Wallet,
          disabled: true,
          badge: 'Soon',
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
          disabled: true,
          badge: 'Soon',
        },
        {
          id: 'settings',
          label: 'Settings',
          href: routes.provider.settings,
          icon: Settings,
          disabled: true,
          badge: 'Soon',
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
          id: 'requests',
          label: 'Requests',
          href: routes.admin.requests,
          icon: ClipboardList,
          disabled: true,
          badge: 'Soon',
        },
        {
          id: 'providers',
          label: 'Providers',
          href: routes.admin.providers,
          icon: Wrench,
          disabled: true,
          badge: 'Soon',
        },
        {
          id: 'customers',
          label: 'Customers',
          href: routes.admin.customers,
          icon: Users,
          disabled: true,
          badge: 'Soon',
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
          disabled: true,
          badge: 'Soon',
        },
        {
          id: 'settings',
          label: 'Settings',
          href: routes.admin.settings,
          icon: Settings,
          disabled: true,
          badge: 'Soon',
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
    Object.assign(labels, customerVehicleBreadcrumbs, customerBreakdownBreadcrumbs);
  }
  if (nav.portalName === 'Provider') {
    Object.assign(labels, providerBreadcrumbs);
  }
  return labels;
}
