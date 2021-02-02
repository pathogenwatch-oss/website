import './login-link.css';

import React from 'react';

export default ({ provider }) => (
  <a
    className={`cgps-login-link cgps-login-link--${provider}`}
    href={`/auth/${provider}`}
  >
    <span className="cgps-login-link__icon"></span>
    <span className="cgps-login-link__text">
      Sign in with <span className="cgps-login-link__provider">{provider}</span>
    </span>
  </a>
);
