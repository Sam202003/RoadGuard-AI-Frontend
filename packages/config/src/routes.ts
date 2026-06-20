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
    aiAssistant: '/customer/ai-assistant',
    settings: '/customer/settings',
  },
  provider: {
    dashboard: '/provider/dashboard',
    requests: '/provider/requests',
    availability: '/provider/availability',
    tracking: '/provider/tracking',
    earnings: '/provider/earnings',
    notifications: '/provider/notifications',
    settings: '/provider/settings',
  },
  admin: {
    dashboard: '/admin/dashboard',
    users: '/admin/users',
    providers: '/admin/providers',
    breakdownRequests: '/admin/breakdown-requests',
    analytics: '/admin/analytics',
    requests: '/admin/breakdown-requests',
    customers: '/admin/users',
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

export function getRolePathPrefix(role: UserRole): string {
  switch (role) {
    case UserRole.CUSTOMER:
      return '/customer';
    case UserRole.PROVIDER:
      return '/provider';
    case UserRole.ADMIN:
      return '/admin';
    default:
      return routes.auth.login;
  }
}

export function isValidUserRole(value: string | undefined): value is UserRole {
  return (
    value === UserRole.CUSTOMER ||
    value === UserRole.PROVIDER ||
    value === UserRole.ADMIN
  );
}

export function isRedirectPathAllowedForRole(path: string, role: UserRole): boolean {
  if (!path.startsWith('/') || path.startsWith('//')) return false;
  return path.startsWith(getRolePathPrefix(role));
}

export function getCustomerVehicleEditPath(vehicleId: string): string {
  return `/customer/vehicles/${vehicleId}/edit`;
}

export function getCustomerBreakdownDetailPath(requestId: string): string {
  return `/customer/breakdown-requests/${requestId}`;
}

export function getProviderRequestDetailPath(requestId: string): string {
  return `/provider/requests/${requestId}`;
}

export function getAdminUserDetailPath(userId: string): string {
  return `/admin/users?user=${userId}`;
}

export function getAdminProviderDetailPath(providerId: string): string {
  return `/admin/providers?provider=${providerId}`;
}

export function getNotificationsPathForRole(role: UserRole): string {
  switch (role) {
    case UserRole.CUSTOMER:
      return routes.customer.notifications;
    case UserRole.PROVIDER:
      return routes.provider.notifications;
    case UserRole.ADMIN:
      return routes.admin.notifications;
    default:
      return routes.customer.notifications;
  }
}

export function getAdminBreakdownDetailPath(requestId: string): string {
  return `/admin/breakdown-requests?request=${requestId}`;
}
