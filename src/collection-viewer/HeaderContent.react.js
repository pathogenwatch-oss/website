import React from 'react';
import { connect } from 'react-redux';

import Search from './search/Search.react';
import AboutCollection from './about-collection';

import { setMenuActive } from '../actions/downloads';

function mapStateToProps({ downloads }) {
  return {
    menuOpen: downloads.menuOpen,
  };
}

function mergeProps({ menuOpen, ...props }, { dispatch }) {
  return {
    ...props,
    downloadMenuButtonClick: () => dispatch(setMenuActive(!menuOpen)),
  };
}

export default connect(mapStateToProps, null, mergeProps)(
  ({ downloadMenuButtonClick }) => (
    <span className="mdl-layout-spacer mdl-layout-spacer--flex">
      <Search />
      <nav className="wgsa-header-collection-options mdl-navigation" onClick={e => e.stopPropagation()}>
        <button className="wgsa-menu-button mdl-button" onClick={downloadMenuButtonClick}>
          <i className="wgsa-button-icon material-icons">file_download</i>
          <span>Downloads</span>
        </button>
        <AboutCollection />
      </nav>
    </span>
  )
);
