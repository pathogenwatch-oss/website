import './styles.css';

import React from 'react';

import AuthRoute from '../sign-in/AuthRoute.react';
import Profile from './Profile.react';

export default (
  <AuthRoute
    authMessage="Please sign in to visit your account."
    path="/account"
    component={Profile}
  />
);
