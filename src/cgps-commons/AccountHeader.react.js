import React from 'react';
import { Link } from 'react-router';

export default ({ photo, name, email }) => (
  <Link className="cgps-avatar cgps-avatar--mini mdl-color-text--blue-grey-50" to="/account">
    <img src={photo} className="cgps-avatar__image" />
    <div className="cgps-avatar__name"><span>{name}</span></div>
    <div className="cgps-avatar__contact"><span>{email}</span></div>
  </Link>
);
