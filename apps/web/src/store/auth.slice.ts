import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { REHYDRATE, type RehydrateAction } from 'redux-persist';
import type { AuthTokens, AuthUser } from '@roadguard/types';
import { clearTokens, setTokens } from '@/lib/auth-storage';

export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated';

interface AuthState {
  user: AuthUser | null;
  tokens: AuthTokens | null;
  status: AuthStatus;
  initialized: boolean;
}

const initialState: AuthState = {
  user: null,
  tokens: null,
  status: 'idle',
  initialized: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading(state) {
      state.status = 'loading';
    },
    setCredentials(
      state,
      action: PayloadAction<{ user: AuthUser; tokens: AuthTokens }>,
    ) {
      state.user = action.payload.user;
      state.tokens = action.payload.tokens;
      state.status = 'authenticated';
      state.initialized = true;
      setTokens(
        action.payload.tokens.accessToken,
        action.payload.tokens.refreshToken,
        action.payload.user.role,
      );
    },
    updateTokens(state, action: PayloadAction<AuthTokens>) {
      state.tokens = action.payload;
      setTokens(
        action.payload.accessToken,
        action.payload.refreshToken,
        state.user?.role,
      );
    },
    setUser(state, action: PayloadAction<AuthUser>) {
      state.user = action.payload;
      state.status = 'authenticated';
      state.initialized = true;
    },
    setInitialized(state) {
      state.initialized = true;
    },
    logout(state) {
      state.user = null;
      state.tokens = null;
      state.status = 'unauthenticated';
      state.initialized = true;
      clearTokens();
    },
  },
  extraReducers: (builder) => {
    builder.addCase(REHYDRATE, (state, action: RehydrateAction) => {
      const payload = action.payload as { auth?: AuthState } | undefined;
      const auth = payload?.auth;
      if (auth?.tokens) {
        setTokens(
          auth.tokens.accessToken,
          auth.tokens.refreshToken,
          auth.user?.role,
        );
        state.tokens = auth.tokens;
        state.user = auth.user;
        state.status = auth.status;
      }
    });
  },
});

export const { setLoading, setCredentials, updateTokens, setUser, setInitialized, logout } =
  authSlice.actions;
export const authReducer = authSlice.reducer;
