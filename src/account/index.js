import './styles.css';

import React from 'react';
import { Route } from 'react-router-dom';

import Profile from './Profile.react';

export reducer from './reducer';

export default (
  <Route path="/account" component={Profile} />
);
