import React from 'react';
import { connect } from 'react-redux';

import { toggleAside } from './index';

const DefaultContent = ({ hasAside, onClick }) => (
  <span className="mdl-layout-spacer mdl-layout-spacer--flex">
    <div className="mdl-layout-spacer" />
    <nav className="mdl-navigation">
      <a className="mdl-navigation__link mdl-navigation__link--active" href="">
        Upload
      </a>
      <a className="mdl-navigation__link" href="">
        Downloads
      </a>
      <a className="mdl-navigation__link" target="_blank" rel="noopener"
        href="https://github.com/ImperialCollegeLondon/wgsa-documentation/wiki"
      >
        Documentation
      </a>
    </nav>
    <button className="mdl-button mdl-button--icon" onClick={onClick}>
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
