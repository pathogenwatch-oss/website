import './styles.css';

import React from 'react';
import { connect } from 'react-redux';

import WGSAMap from '../../map';
import LeafletPieChartMarker from '../../cgps-commons/LeafletPieChartMarker.react';

import { filterByLassoPath } from './actions';
import { getMarkers } from './selectors';

import { COLLECTION } from '../../app/stateKeys/map';

import {
  activateFilter,
  appendToFilter,
  removeFromFilter,
  resetFilter,
} from '../filter/actions';

const ExplorerMap = ({ markers, onLassoPathChange, onMarkerClick, onClick }) => (
  <WGSAMap
    className="wgsa-collection-viewer-map"
    stateKey={COLLECTION}
    markers={markers}
    markerComponent={LeafletPieChartMarker}
    onClick={onClick}
    onLassoPathChange={onLassoPathChange}
    onMarkerClick={onMarkerClick}
  />
);

function mapStateToProps(state) {
  return {
    markers: getMarkers(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onClick: () => dispatch(filterByLassoPath(COLLECTION, null)),
    onLassoPathChange: path => dispatch(filterByLassoPath(COLLECTION, path)),
    onMarkerClick: ({ id, event }) => dispatch(activateFilter(id)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ExplorerMap);
