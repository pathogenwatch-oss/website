import React from 'react';

import NavLink from '../location';

export default () => (
  <nav className="wgsa-header-content mdl-navigation">
    <NavLink to="/collections">Collections</NavLink>
    <NavLink to="/genomes">Genomes</NavLink>
    <NavLink to="/upload">Upload</NavLink>
    <NavLink to="/documentation" className="sm-hide">Documentation</NavLink>
    <NavLink to="https://gitlab.com/cgps/wgsa.net/issues" className="sm-hide" external>Feedback</NavLink>
  </nav>
);
