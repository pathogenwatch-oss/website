import React from 'react';
import { connect } from 'react-redux';

import NavLink from '../location';

import { isAsideVisible } from './selectors';

import { toggleAside } from './actions';

const DefaultContent = ({ asideVisible, toggle, asideEnabled = false }) => (
  <nav className="wgsa-header-content mdl-navigation">
    <NavLink to="/collections">Collections</NavLink>
    <NavLink to="/genomes">Genomes</NavLink>
    <NavLink to="/upload">Upload</NavLink>
    <NavLink to="/documentation" className="sm-hide">Documentation</NavLink>
    <NavLink to="https://gitlab.com/cgps/wgsa.net/issues" className="sm-hide" external>Feedback</NavLink>
    <button
      className="mdl-button mdl-button--icon wgsa-search-button"
      onClick={() => toggle(asideVisible)}
      disabled={!asideEnabled}
    >
      <i className="material-icons">
        {asideVisible ? 'chevron_right' : 'search'}
      </i>
    </button>
  </nav>
);

function mapStateToProps(state, { asideEnabled = false }) {
  return {
    asideVisible: asideEnabled && isAsideVisible(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    toggle: asideVisible => dispatch(toggleAside(!asideVisible)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DefaultContent);
