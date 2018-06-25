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
      if (config.user) {
        const { redirect = '/account' } = queryString.parse(location.search);
        return <Redirect to={redirect} />;
      }
      return <SignIn message={location.state && location.state.message} />;
    }}
  />
);
