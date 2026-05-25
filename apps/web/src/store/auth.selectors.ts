import type { RootState } from './index';

export const selectAuthUser = (state: RootState) => state.auth.user;
export const selectAuthStatus = (state: RootState) => state.auth.status;
export const selectAuthInitialized = (state: RootState) => state.auth.initialized;
export const selectIsAuthenticated = (state: RootState) =>
  state.auth.status === 'authenticated' && state.auth.user !== null;
