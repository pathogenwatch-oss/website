import React from 'react';
import { Route } from 'react-router';

export reducer from './reducer';

import Offline from './Offline.react';

export default (
  <Route path="offline" component={Offline} />
);
