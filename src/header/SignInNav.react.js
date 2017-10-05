import React from 'react';

import LoginLink from '../cgps-commons/LoginLink.react';
import SignInPasswordless from './SignInPasswordless.react';

import config from '../app/config';
const { user } = config;

const SignInNav = () => {
  const { strategies = [] } = config;

  if (user) return null;

  return (
    <nav className="mdl-navigation">
      { strategies.filter(_ => _ !== 'passwordless').map(provider => <LoginLink key={provider} provider={provider} />) }
      { strategies.includes('passwordless') && <SignInPasswordless /> }
    </nav>
  );
};

export default SignInNav;
