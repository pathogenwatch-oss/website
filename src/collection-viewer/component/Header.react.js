import React from 'react';
import { connect } from 'react-redux';

import Search from '../search/Search.react';
import AboutCollection from '../about-collection';

import { isMenuOpen } from '../downloads/selectors';
import { setMenuActive } from '../downloads/actions';
import { isClusterView } from '../selectors';

function mapStateToProps(state) {
  return {
    clusterView: isClusterView(state),
    menuOpen: isMenuOpen(state),
  };
}

function mergeProps({ menuOpen, ...props }, { dispatch }) {
  return {
    ...props,
    downloadMenuButtonClick: () => dispatch(setMenuActive(!menuOpen)),
  };
}

export default connect(mapStateToProps, null, mergeProps)(
  ({ downloadMenuButtonClick, clusterView }) => (
    <span className="mdl-layout-spacer mdl-layout-spacer--flex">
      <Search />
      <nav className="wgsa-header-collection-options mdl-navigation" onClick={e => e.stopPropagation()}>
        <button className="wgsa-menu-button mdl-button" onClick={downloadMenuButtonClick}>
          <i className="wgsa-button-icon material-icons">file_download</i>
          <span>Downloads</span>
        </button>
        { !clusterView && <AboutCollection /> }
      </nav>
    </span>
  )
);
