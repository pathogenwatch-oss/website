import './styles.css';

import React from 'react';
import { connect } from 'react-redux';

import LeafletMap from '../cgps-commons/LeafletMap.react';

import { getBounds, getLassoPath } from './selectors';

import CONFIG from '../app/config';

import { CGPS } from '../app/constants';

import * as actions from './actions';

const WGSAMap = props => (
  <div
    className={props.className}
    onClick={props.onClick}
  >
    <LeafletMap
      center={props.bounds.center}
      className="wgsa-map"
      cluster={props.cluster}
      highlightedColour={CGPS.COLOURS.PURPLE}
      lassoButtonClassname="wgsa-map-lasso-button mdl-button mdl-button--fab mdl-button--mini-fab"
      lassoPath={props.lassoPath}
      markers={props.markers}
      markerComponent={props.markerComponent}
      mapboxKey={CONFIG.mapboxKey}
      mapboxStyle="light-v9"
      onBoundsChange={props.onBoundsChange}
      onLassoPathChange={props.onLassoPathChange}
      onMarkerClick={props.onMarkerClick}
      zoom={props.bounds.zoom}
    />
  </div>

);

function mapStateToProps(state, props) {
  return {
    bounds: props.bounds || getBounds(state, props),
    lassoPath: props.lassoPath || getLassoPath(state, props),
  };
}

function mapDispatchToProps(dispatch, { stateKey, onLassoPathChange }) {
  return {
    onBoundsChange: bounds => dispatch(actions.storeBounds(stateKey, bounds)),
    onLassoPathChange: onLassoPathChange ||
      (path => dispatch(actions.changeLassoPath(stateKey, path))),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(WGSAMap);
