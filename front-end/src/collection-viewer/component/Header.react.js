import React from 'react';
import { connect } from 'react-redux';

import Search from '../search/Search.react';
import AddPrivateMetadata from '../private-metadata';
import AboutCollection from '../about-collection';
import Downloads from '../downloads';

import { isClusterView } from '../selectors';

function mapStateToProps(state) {
  return {
    clusterView: isClusterView(state),
  };
}

export default connect(mapStateToProps)(
  ({ clusterView }) => (
    <span className="mdl-layout-spacer mdl-layout-spacer--flex">
      <Search />
      <nav className="wgsa-header-collection-options mdl-navigation" onClick={e => e.stopPropagation()}>
        <Downloads />
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
