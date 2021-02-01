import './styles.css';

import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import queryString from 'query-string';

import SignIn from './SignIn.react';

import config from '../app/config';

export default (
  <Route
    path="/sign-in"
    render={({ location = {} }) => {
      const { message, redirect = '/account' } = queryString.parse(location.search);
      if (message) {
        return <SignIn message={message} />;
      }
      if (config.user) {
        return <Redirect to={redirect} />;
      }
      return <SignIn message={location.state && location.state.message} />;
    }}
  />
);
