import React from 'react';
import { Route, IndexRoute } from 'react-router';

import Profile from './Profile.react';

import config from '../app/config';

function requireLogin(nextState, replace) {
  if (!config.user) replace('/');
}

export default (
  <Route path="account" onEnter={requireLogin}>
    <IndexRoute component={Profile} />
    <Route path="collections" component={() => <h1>collections</h1>} />
    <Route path="genomes" component={() => <h1>genomes</h1>} />
  </Route>
);
