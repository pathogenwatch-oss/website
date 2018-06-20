import React from 'react';

import Login from 'cgps-user-accounts/components/login';
import Passwordless from './Passwordless.react';

const termsLink = (
  <a target="_blank" rel="noopener" href="https://cgps.gitbook.io/pathogenwatch/privacy-and-tos">
    terms of service
  </a>
);

export default ({ message }) => (
  <div className="pw-signin-page">
    <Login
      appName="Pathogenwatch"
      strategies={[ 'google', 'twitter', 'facebook' ]}
      additional={<Passwordless />}
      termsLink={termsLink}
      message={message}
    />
  </div>
);
