import type { ListAdminProvidersParams, ListAdminUsersParams } from '../types/admin.types';

export const DEFAULT_ADMIN_USERS_QUERY: ListAdminUsersParams = {
  page: 1,
  limit: 10,
};

export const DEFAULT_ADMIN_PROVIDERS_QUERY: ListAdminProvidersParams = {
  page: 1,
  limit: 10,
};

export const ADMIN_BREAKDOWN_LIST_QUERY = {
  page: 1,
  limit: 100,
  sort: '-requestedAt',
} as const;
