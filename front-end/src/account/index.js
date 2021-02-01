import './styles.css';

import React from 'react';

import AuthRoute from '../sign-in/AuthRoute.react';
import Profile from './Profile.react';
import DocumentTitle from '../branding/DocumentTitle.react';

export default (
  <AuthRoute
    authMessage="Please sign in to visit your account."
    path="/account"
    component={() =>
      <React.Fragment>
        <DocumentTitle>Account</DocumentTitle>
        <Profile />
      </React.Fragment>}
  />
);
