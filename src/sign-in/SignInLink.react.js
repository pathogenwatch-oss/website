import React from 'react';
import { Link } from 'react-router-dom';

export default ({ children, className, redirect = `${window.location.pathname}${window.location.search}` }) => (
  <Link className={className} to={`/sign-in?redirect=${redirect}`}>
    {children}
  </Link>
);
