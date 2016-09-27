import '../css/header.css';

import React from 'react';
import { connect } from 'react-redux';

import { updateHeader } from '^/actions/header';

import { getHeader } from '../../selectors';

export const Header = ({ hasAside, toggleAside }) => (
  <span className="mdl-layout-spacer mdl-layout-spacer--flex">
    <div className="mdl-layout-spacer" />
    <nav className="mdl-navigation">
      <a className="mdl-navigation__link mdl-navigation__link--active" href="">Upload</a>
      <a className="mdl-navigation__link" href="">Downloads</a>
      <a className="mdl-navigation__link" href="">Documentation</a>
    </nav>
    <button className="mdl-button mdl-button--icon" onClick={() => toggleAside(hasAside)}>
      <i className="material-icons">{hasAside ? 'chevron_right' : 'search'}</i>
    </button>
  </span>
);

function mapStateToProps(state) {
  return {
    hasAside: getHeader(state).hasAside,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    toggleAside: (hasAside) => {
      dispatch(
        updateHeader({
          hasAside: !hasAside,
        })
      );
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
