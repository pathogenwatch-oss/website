import React from 'react';
import { connect } from 'react-redux';

import WGSAMap from '../../map';

import * as filter from '../../filter';
import { showAssemblyDetails } from '../../assembly-drawer';

import { getMarkers, getLassoPath } from './selectors';
import { UPLOAD } from '../../app/stateKeys/map';

const MapView = ({ lassoPath, markers, onLassoPathChange, onMarkerClick }) => (
  <WGSAMap
    className="wgsa-collection-viewer-map"
    cluster
    lassoPath={lassoPath}
    markers={markers}
    onLassoPathChange={onLassoPathChange}
    onMarkerClick={onMarkerClick}
    stateKey={UPLOAD}
  />
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
    onMarkerClick: ({ id }) => dispatch(showAssemblyDetails(id)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MapView);
