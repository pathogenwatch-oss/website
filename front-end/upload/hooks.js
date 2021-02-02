import React from 'react';
import store from '~/app/store';

import { fetchAssemblerUsage } from './actions';

export const useAssemblerUsage = (token) => {
  React.useEffect(() => {
    const state = store.getState();
    if (token && !state.auth.pending) {
      store.dispatch(fetchAssemblerUsage(token));
    }
  }, [ token ]);
};
