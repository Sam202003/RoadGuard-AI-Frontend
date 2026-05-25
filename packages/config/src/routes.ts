import { UserRole } from '@roadguard/types';

export const routes = {
  auth: {
    login: '/login',
    register: '/register',
  },
  customer: {
    dashboard: '/customer/dashboard',
    vehicles: '/customer/vehicles',
    vehiclesAdd: '/customer/vehicles/add',
    breakdown: '/customer/breakdown-requests',
    breakdownNew: '/customer/breakdown-requests/new',
    tracking: '/customer/tracking',
    notifications: '/customer/notifications',
    settings: '/customer/settings',
  },
  provider: {
    dashboard: '/provider/dashboard',
    requests: '/provider/requests',
    availability: '/provider/availability',
    earnings: '/provider/earnings',
    notifications: '/provider/notifications',
    settings: '/provider/settings',
  },
  admin: {
    dashboard: '/admin/dashboard',
    requests: '/admin/requests',
    providers: '/admin/providers',
    customers: '/admin/customers',
    notifications: '/admin/notifications',
    settings: '/admin/settings',
  },
} as const;

export function getDashboardPathForRole(role: UserRole): string {
  switch (role) {
    case UserRole.CUSTOMER:
      return routes.customer.dashboard;
    case UserRole.PROVIDER:
      return routes.provider.dashboard;
    case UserRole.ADMIN:
      return routes.admin.dashboard;
    default:
      return routes.auth.login;
  }
}

export const protectedPrefixes = ['/customer', '/provider', '/admin'] as const;

export const authPaths = [routes.auth.login, routes.auth.register] as const;

export function getCustomerVehicleEditPath(vehicleId: string): string {
  return `/customer/vehicles/${vehicleId}/edit`;
}

export function getCustomerBreakdownDetailPath(requestId: string): string {
  return `/customer/breakdown-requests/${requestId}`;
}

export function getProviderRequestDetailPath(requestId: string): string {
  return `/provider/requests/${requestId}`;
}
