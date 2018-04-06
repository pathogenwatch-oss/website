import 'cgps-commons/Avatar/cgps-avatar.css';

import React from 'react';
import { Link } from 'react-router-dom';

import AccountImage from '../account/AccountImage.react';
import { Name } from '../branding';

const className = 'cgps-avatar cgps-avatar--top wgsa-account-header';

export default function AvatarLink({ user }) {
  if (user) {
    return (
      <Link className={className} to="/account" >
        <AccountImage />
        <div className="cgps-avatar__name" title={user.name}>{user.name}</div>
        <div className="cgps-avatar__contact" title={user.email}>{user.email}</div>
      </Link>
    );
  }

  return (
    <div className={className}>
      <AccountImage />
      <div className="cgps-avatar__name" title="WGSA"><Name /></div>
      <div className="cgps-avatar__contact" title="Sign In or Create Account">
        Sign In or Create Account
      </div>
    </div>
  );
}
