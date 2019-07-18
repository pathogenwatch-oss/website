import React from 'react';
import { connect } from 'react-redux';

import Search from '../search/Search.react';
import AddPrivateMetadata from '../private-metadata';
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
        <button title="Downloads" className="mdl-button mdl-button--icon" onClick={downloadMenuButtonClick}>
          {/* hacking for alignment! */}
          <i className="material-icons" style={{ marginTop: '1px' }}>file_download</i>
        </button>
        <AddPrivateMetadata />
        { !clusterView && <AboutCollection /> }
      </nav>
      <style>
        {`.libmr-RelativePortal > div {
          z-index: 3;
        }`}
      </style>
    </span>
  )
);
