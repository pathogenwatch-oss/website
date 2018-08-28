import React from 'react';
import { Route } from 'react-router-dom';

import OfflineRoute from './Offline.react';

export { isOffline } from './utils';

export default (
  <Route path="/offline" component={OfflineRoute} />
);
