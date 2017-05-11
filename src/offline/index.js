import React from 'react';
import { Route } from 'react-router';

import content from './Offline.react';

export reducer from './reducer';
export { isOffline } from './utils';

export default (
  <Route path="offline" component={content} />
);
