import { useEffect } from 'react';

import store from '../app/store';
import { getAuthToken } from './actions';

export function useAuthToken() {
  const state = store.getState();
  const { token } = state.auth;
  useEffect(() => {
    if (!token) {
      store.dispatch(getAuthToken());
    }
  }, [ token ]);
}
