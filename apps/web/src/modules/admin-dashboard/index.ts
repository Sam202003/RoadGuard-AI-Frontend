export { AdminDashboardPage } from './pages/admin-dashboard-page';
export { AdminUsersPage } from './pages/admin-users-page';
export { AdminProvidersPage } from './pages/admin-providers-page';
export { AdminBreakdownRequestsPage } from './pages/admin-breakdown-requests-page';
export { AdminAnalyticsPage } from './pages/admin-analytics-page';

export {
  useGetAdminDashboardQuery,
  useListAdminUsersQuery,
  useGetAdminUserQuery,
  useUpdateAdminUserStatusMutation,
  useListAdminProvidersQuery,
  useGetAdminProviderQuery,
  useGetAdminAnalyticsQuery,
  useListAdminBreakdownRequestsQuery,
} from './api';

export type {
  AdminDashboardStats,
  AdminActivityItem,
  AdminUser,
  AdminProvider,
  AdminAnalytics,
  ListAdminUsersParams,
  ListAdminProvidersParams,
} from './types/admin.types';
