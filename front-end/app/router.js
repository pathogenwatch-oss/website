import React from 'react';

import { Router, Route } from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory';

import App from './App.react';

export const history = createBrowserHistory();

export default () => (
  <Router history={history}>
    <Route component={App} />
  </Router>
);
