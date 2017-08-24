import React from 'react';
import { connect } from 'react-redux';

import NavLink from '../location';

import { isAsideVisible } from './selectors';

import { toggleAside } from './actions';

import { isOffline } from '../offline';

const OfflineContent = () => (
  <span className="wgsa-header-content">
    <span className="mdl-navigation__link">Offline Mode</span>
  </span>
);

const DefaultContent = ({ offline, asideVisible, toggle, asideEnabled = false }) => (
  offline ?
  <OfflineContent /> :
  <nav className="wgsa-header-content mdl-navigation">
    <NavLink to="/collections/all">Collections</NavLink>
    <NavLink to="/genomes/all">Genomes</NavLink>
    <NavLink to="/genomes/upload">Upload</NavLink>
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
    offline: isOffline(),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    toggle: asideVisible => dispatch(toggleAside(!asideVisible)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DefaultContent);
