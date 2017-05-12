import 'cgps-commons/Avatar/cgps-avatar.css';

import React from 'react';
import { Link } from 'react-router-dom';

export default function AvatarLink({ user, linkTo, image, className }) {
  return (
    <Link
      className={`cgps-avatar cgps-avatar--${image} ${className}`}
      to={linkTo}
    >
      <img src={user.photo} className="cgps-avatar__image" />
      <div className="cgps-avatar__name" title={user.name}>{user.name}</div>
      <div className="cgps-avatar__contact" title={user.email}>{user.email}</div>
    </Link>
  );
}
