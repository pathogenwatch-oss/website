import React from 'react';
import { connect } from 'react-redux';

import NavLink from '../nav-link';

import { toggleAside } from './index';

const links = [
  { text: 'Home', link: '/', activeOnIndexOnly: true },
  { text: 'Upload', link: '/upload' },
  { text: 'Documentation', link: '/documentation' },
];

const DefaultContent = ({ hasAside, onClick }) => (
  <span className="mdl-layout-spacer mdl-layout-spacer--flex">
    <div className="mdl-layout-spacer" />
    <nav className="mdl-navigation">
      { links.map(props => <NavLink key={props.link} {...props} />) }
    </nav>
    <button className="mdl-button mdl-button--icon wgsa-search-button" onClick={onClick}>
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
