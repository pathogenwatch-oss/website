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
      const qs = queryString.parse(location.search);
      if (qs.redirect && config.user) {
        return <Redirect to={qs.redirect} />;
      }
      return <SignIn message={location.state && location.state.message} />;
    }}
  />
);
