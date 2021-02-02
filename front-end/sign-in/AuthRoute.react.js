import React from 'react';
import { Route, Redirect } from 'react-router';

import config from '../app/config';

export default ({ authMessage, ...props }) => {
  if (config.user) {
    return <Route {...props} />;
  }
  return (
    <Redirect
      to={{
        pathname: '/sign-in',
        search: `?redirect=${props.path}`,
        state: { message: authMessage },
      }}
    />
  );
};
