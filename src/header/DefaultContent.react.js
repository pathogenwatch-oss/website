import React from 'react';
import { connect } from 'react-redux';

import NavLink from '../location';

import { toggleAside } from './actions';

export const DefaultContent = ({ hasAside, onClick, asideDisabled }) => (
  <span className="mdl-layout-spacer mdl-layout-spacer--flex">
    <div className="mdl-layout-spacer" />
    <nav className="mdl-navigation wgsa-header-nav">
      <NavLink to="/collections/all">Collections</NavLink>
      <NavLink to="/genomes/all">Genomes</NavLink>
      <NavLink to="/genomes/upload">Upload</NavLink>
      <NavLink to="/documentation">Documentation</NavLink>
    </nav>
    <button
      className="mdl-button mdl-button--icon wgsa-search-button"
      onClick={onClick}
      disabled={asideDisabled}
    >
      <i className="material-icons">{hasAside ? 'chevron_right' : 'search'}</i>
    </button>
  </span>
);

function mapDispatchToProps(dispatch, { hasAside }) {
  return {
    onClick: () => dispatch(toggleAside(!hasAside)),
  };
}

export default connect(null, mapDispatchToProps)(DefaultContent);
