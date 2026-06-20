import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { authReducer } from './auth.slice';
import { authApi } from './api/auth.api';
import { vehiclesApi } from './api/vehicles.api';
import { breakdownApi } from './api/breakdown.api';
import { providerApi } from './api/provider.api';
import { adminApi } from './api/admin.api';
import { notificationsApi } from './api/notifications.api';
import { aiApi } from './api/ai.api';

const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['user', 'tokens', 'status'],
};

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  [authApi.reducerPath]: authApi.reducer,
  [vehiclesApi.reducerPath]: vehiclesApi.reducer,
  [breakdownApi.reducerPath]: breakdownApi.reducer,
  [providerApi.reducerPath]: providerApi.reducer,
  [adminApi.reducerPath]: adminApi.reducer,
  [notificationsApi.reducerPath]: notificationsApi.reducer,
  [aiApi.reducerPath]: aiApi.reducer,
});

export const makeStore = () => {
  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }).concat(
        authApi.middleware,
        vehiclesApi.middleware,
        breakdownApi.middleware,
        providerApi.middleware,
        adminApi.middleware,
        notificationsApi.middleware,
        aiApi.middleware,
      ),
  });

  return store;
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

export const makePersistor = (store: AppStore) => persistStore(store);
