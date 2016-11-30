import './styles.css';

import React from 'react';
import { connect } from 'react-redux';

import LeafletMap from '../cgps-commons/LeafletMap.react';

import { getBounds, getLassoPath } from './selectors';

import CONFIG from '../app/config';

import { CGPS } from '../app/constants';

import * as actions from './actions';

const WGSAMap = props => (
  <LeafletMap
    center={props.bounds.center}
    className={props.className}
    cluster={props.cluster}
    highlightedColour={CGPS.COLOURS.PURPLE}
    buttonClassname="mdl-button mdl-button--icon wgsa-map-button"
    lassoPath={props.lassoPath}
    markers={props.markers}
    markerComponent={props.markerComponent}
    mapboxKey={CONFIG.mapboxKey}
    mapboxStyle="light-v9"
    onBoundsChange={props.onBoundsChange}
    onClick={props.onClick}
    onGroupMarkersChange={props.onGroupMarkersChange}
    onLassoPathChange={props.onLassoPathChange}
    onMarkerClick={props.onMarkerClick}
    zoom={props.bounds.zoom}
  />
);

function mapStateToProps(state, props) {
  return {
    bounds: getBounds(state, props),
    lassoPath: props.lassoPath || getLassoPath(state, props),
  };
}

function mapDispatchToProps(dispatch, { stateKey, onLassoPathChange }) {
  return {
    onBoundsChange: bounds => dispatch(actions.storeBounds(stateKey, bounds)),
    onGroupMarkersChange:
      group => dispatch(actions.toggleGroupMarkers(stateKey, group)),
    onLassoPathChange: onLassoPathChange ||
      (path => dispatch(actions.changeLassoPath(stateKey, path))),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(WGSAMap);
