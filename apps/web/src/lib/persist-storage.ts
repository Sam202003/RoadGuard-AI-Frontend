import type { Storage } from 'redux-persist';

/**
 * redux-persist storage that is safe for Next.js SSR.
 * Uses localStorage on the client; noop on the server.
 */
const persistStorage: Storage = {
  getItem(key: string) {
    if (typeof window === 'undefined') {
      return Promise.resolve(null);
    }
    return Promise.resolve(localStorage.getItem(key));
  },
  setItem(key: string, value: string) {
    if (typeof window === 'undefined') {
      return Promise.resolve(value);
    }
    localStorage.setItem(key, value);
    return Promise.resolve(value);
  },
  removeItem(key: string) {
    if (typeof window === 'undefined') {
      return Promise.resolve();
    }
    localStorage.removeItem(key);
    return Promise.resolve();
  },
};

export default persistStorage;
