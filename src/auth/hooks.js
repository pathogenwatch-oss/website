import { useEffect } from 'react';

import store from '../app/store';
import { getAuthToken } from './actions';

export function useAuthToken(refresh = false) {
  const state = store.getState();
  const { token } = state.auth;
  useEffect(() => {
    if (refresh || !token) {
      store.dispatch(getAuthToken());
    }
  }, [ token ]);
}
