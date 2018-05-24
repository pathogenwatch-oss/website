import './LoginLinks.css';

import React from 'react';

const LoginLinks = ({ strategies = [], children }) => (
  <div className="cgps-login-links">
    { strategies
        .filter(item => (item !== 'passwordless'))
        .map(strategy =>
          <a
            key={strategy}
            className={`cgps-login-button cgps-login-button--${strategy}`}
            href={`/auth/${strategy}`}
          >
            <div className="cgps-login-button__icon"></div>
            <div className="cgps-login-button__text">
              Sign in with { strategy }
            </div>
          </a>
        ) }
    { children }
  </div>
);

export default LoginLinks;
