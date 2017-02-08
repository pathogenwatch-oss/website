import React from 'react';
import { connect } from 'react-redux';

import WGSAMap from '../../map';

import * as filter from '../../filter';
import { showGenomeDrawer } from '../../genome-drawer';

import { getMarkers, getLassoPath } from './selectors';
import { UPLOAD } from '../../app/stateKeys/map';

const clusterOptions = {
  polygonOptions: {
    color: '#3c7383',
    opacity: 0.8,
    fillOpacity: 0.375,
  },
};

const MapView = ({ lassoPath, markers, onLassoPathChange, onMarkerClick }) => (
  <div>
    <WGSAMap
      className="wgsa-hub-map-view"
      cluster
      clusterOptions={clusterOptions}
      lassoPath={lassoPath}
      markers={markers}
      onLassoPathChange={onLassoPathChange}
      onMarkerClick={onMarkerClick}
      stateKey={UPLOAD}
    />
  </div>
);

function mapStateToProps(state) {
  return {
    markers: getMarkers(state),
    lassoPath: getLassoPath(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onLassoPathChange: path => dispatch(filter.update(UPLOAD, { key: 'area' }, path)),
    onMarkerClick: ({ id }) => dispatch(showGenomeDrawer(id)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MapView);
