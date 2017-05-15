import './styles.css';

import React from 'react';
import { Route } from 'react-router-dom';

import RequireLogin from './RequireLogin.react';
import Profile from './Profile.react';

export reducer from './reducer';

const AccountRoute = (props) => (
  <RequireLogin {...props}>
    <Profile />
  </RequireLogin>
);

export default (
  <Route path="/account" component={AccountRoute} />
);
