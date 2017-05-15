import 'cgps-commons/Avatar/cgps-avatar.css';

import React from 'react';
import { Link } from 'react-router-dom';

const className = 'cgps-avatar cgps-avatar--top wgsa-account-header';

export default function AvatarLink({ user }) {
  if (user) {
    return (
      <Link className={className} to="/account" >
        <img src={user.photo} className="cgps-avatar__image" />
        <div className="cgps-avatar__name" title={user.name}>{user.name}</div>
        <div className="cgps-avatar__contact" title={user.email}>{user.email}</div>
      </Link>
    );
  }

  return (
    <div className={className}>
      <img src="/images/user.svg" className="cgps-avatar__image" />
      <div className="cgps-avatar__name" title="WGSA">WGSA</div>
      <div className="cgps-avatar__contact" title="Sign In or Create Account">
        Sign In or Create Account
      </div>
    </div>
  );
}
