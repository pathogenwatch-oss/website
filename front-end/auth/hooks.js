import { useEffect } from 'react';

import store from '../app/store';
import { getAuthToken } from './actions';

export function useAuthToken(refresh = false) {
  const state = store.getState();
  const { token, pending } = state.auth;

  useEffect(() => {
    if (!token && !pending) {
      store.dispatch(getAuthToken());
    }
  }, [ token, pending ]);

  // update existing token only once on mount
  useEffect(() => {
    if (token && refresh) {
      store.dispatch(getAuthToken());
    }
  }, []);
}
