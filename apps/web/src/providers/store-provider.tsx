'use client';

import { useRef } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { AuthLoadingSpinner } from '@/components/auth-loading-spinner';
import { makePersistor, makeStore, type AppStore } from '@/store';

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<AppStore | null>(null);
  const persistorRef = useRef<ReturnType<typeof makePersistor> | null>(null);

  if (!storeRef.current) {
    storeRef.current = makeStore();
    persistorRef.current = makePersistor(storeRef.current);
  }

  return (
    <Provider store={storeRef.current}>
      <PersistGate loading={<AuthLoadingSpinner />} persistor={persistorRef.current!}>
        {children}
      </PersistGate>
    </Provider>
  );
}
