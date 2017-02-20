import React from 'react';
import { connect } from 'react-redux';

import WGSAMap from '../../map';

import { filterByArea } from '../filter/actions';
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

const MapView = ({ lassoPath, markers, onClick, onLassoPathChange, onMarkerClick }) => (
  <div>
    <WGSAMap
      className="wgsa-hub-map-view"
      cluster
      clusterOptions={clusterOptions}
      lassoPath={lassoPath}
      markers={markers}
      onClick={onClick}
      onLassoPathChange={onLassoPathChange}
      onMarkerClick={onMarkerClick}
      stateKey={UPLOAD}
    />
  </div>
);

function mapStateToProps(state) {
  return {
    lassoPath: getLassoPath(state),
    markers: getMarkers(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onLassoPathChange:
      path => dispatch(filterByArea(path)),
    onClick: () => dispatch(filterByArea(null)),
    onMarkerClick: ({ id }) => dispatch(showGenomeDrawer(id)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MapView);
