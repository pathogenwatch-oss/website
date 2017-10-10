import React from 'react';

import NavLink from '../location';

import { isOffline } from '../offline';

const OfflineContent = () => (
  <span className="wgsa-header-content">
    <span className="mdl-navigation__link">Offline Mode</span>
  </span>
);

export default ({ offline = isOffline() }) => (
  offline ?
  <OfflineContent /> :
  <nav className="wgsa-header-content mdl-navigation">
    <NavLink to="/collections">Collections</NavLink>
    <NavLink to="/genomes">Genomes</NavLink>
    <NavLink to="/upload">Upload</NavLink>
    <NavLink to="/documentation" className="sm-hide">Documentation</NavLink>
    <NavLink to="mailto:cgps@sanger.ac.uk" className="sm-hide" external>Contact</NavLink>
  </nav>
);
