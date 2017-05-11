import React from 'react';
import { Route } from 'react-router';

import content from './Offline.react';
import header from './Header.react';

import { isOffline } from './utils';

export reducer from './reducer';
export { isOffline } from './utils';

export default (
  <Route
    path="offline"
    components={{
      content,
      header: isOffline() ? header : null,
    }}
  />
);
