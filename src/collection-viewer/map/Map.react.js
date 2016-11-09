import './styles.css';

import React from 'react';
import { connect } from 'react-redux';

import WGSAMap from '../../map';
import LeafletPieChartMarker from '../../cgps-commons/LeafletPieChartMarker.react';

import { getMarkers } from './selectors';

import { COLLECTION } from '../../app/stateKeys/map';

import {
  activateFilter,
  appendToFilter,
  removeFromFilter,
  resetFilter,
} from '../filter/actions';

const ExplorerMap = ({ markers, onMarkerClick, onClick }) => (
  <WGSAMap
    className="wgsa-collection-viewer-map"
    stateKey={COLLECTION}
    markers={markers}
    markerComponent={LeafletPieChartMarker}
    onClick={onClick}
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
    onClick: () => dispatch(resetFilter()),
    onMarkerClick: ({ id, event }) => dispatch(activateFilter(id)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ExplorerMap);
