import React from 'react';
import store from '~/app/store';

import { fetchAssemblerUsage } from './actions';

export const useAssemblerUsage = (token) => {
  React.useEffect(() => {
    if (token) {
      store.dispatch(fetchAssemblerUsage(token));
    }
  }, [ token ]);
};
