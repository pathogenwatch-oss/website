import React from 'react';

import { Login } from './cgps-user-accounts';
import Passwordless from './Passwordless.react';

export default () => (
  <div className="wgsa-signin-page">
    <Login
      appName="WGSA"
      strategies={[ 'google', 'twitter', 'facebook' ]}
      additional={<Passwordless />}
    />
  </div>
);
