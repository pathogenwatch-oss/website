import './styles.css';

import React from 'react';
import { Route, IndexRoute } from 'react-router';

import Genomes from '../genomes/component';
import Profile from './Profile.react';

import config from '../app/config';

function requireLogin(nextState, replace) {
  if (!config.user) replace('/');
}

const UserGenomes = props => (<Genomes {...props} user />);

export reducer from './reducer';

export default (
  <Route path="account" onEnter={requireLogin}>
    <IndexRoute component={Profile} />
    <Route path="collections" component={() => <h1>collections</h1>} />
    <Route path="genomes" component={UserGenomes} />
  </Route>
);
