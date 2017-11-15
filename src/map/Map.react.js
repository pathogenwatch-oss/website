import './styles.css';

import React from 'react';
import { connect } from 'react-redux';

import LeafletMap from '../cgps-commons/LeafletMap.react';

import { getBounds } from './selectors';

import CONFIG from '../app/config';

import { CGPS } from '../app/constants';

import * as actions from './actions';

export const buttonClassname =
  'mdl-button mdl-button--icon wgsa-pane-button wgsa-pane-button--dark';

export const activeButtonClassname = 'wgsa-pane-button--active';

const WGSAMap = props => (
  <LeafletMap
    center={props.bounds.center}
    className={props.className}
    cluster={props.cluster}
    clusterOptions={props.clusterOptions}
    highlightedColour={CGPS.COLOURS.PURPLE}
    buttonClassname={buttonClassname}
    lassoPath={props.lassoPath}
    markers={props.markers}
    markerIds={props.markerIds}
    markerComponent={props.markerComponent}
    markerProps={props.markerProps}
    markerSize={props.markerSize}
    mapboxKey={CONFIG.mapboxKey}
    mapboxStyle="light-v9"
    onBoundsChange={props.onBoundsChange}
    onClick={props.onClick}
    onGroupMarkersChange={props.onGroupMarkersChange}
    onLassoPathChange={props.onLassoPathChange}
    onMarkerClick={props.onMarkerClick}
    zoom={props.bounds.zoom}
  >
    {props.children}
  </LeafletMap>
);

function mapStateToProps(state, props) {
  return {
    bounds: getBounds(state, props),
    lassoPath: props.lassoPath,
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
