import './styles.css';

import React from 'react';
import { connect } from 'react-redux';

import LeafletMap from '../../cgps-commons/LeafletMap.react';
import LeafletPieChartMarker from '../../cgps-commons/LeafletPieChartMarker.react';

import { getMarkers } from './selectors';

import CONFIG from '../../app/config';

import {
  activateFilter,
  appendToFilter,
  removeFromFilter,
  resetFilter,
} from '../../actions/filter';

const ExplorerMap = ({ markers, onMarkerClick, onClick }) => (
  <div
    className="wgsa-collection-viewer-map"
    onClick={onClick}
  >
    <LeafletMap
      className="wgsa-collection-viewer-map"
      markers={markers}
      markerComponent={LeafletPieChartMarker}
      mapboxStyle="light-v9"
      mapboxKey={CONFIG.mapboxKey}
      center={[ 0, 0 ]}
      zoom={1}
      // lassoPath={this.props.lassoPath}
      lassoButtonClassname="wgsa-map-lasso-button mdl-button mdl-button--fab mdl-button--mini-fab"
      // onBoundsChange={this.props.onBoundsChange}
      // onLassoPathChange={this.props.onLassoPathChange}
      onMarkerClick={onMarkerClick}
    />
  </div>

);

ExplorerMap.propTypes = {
  dimensions: React.PropTypes.object,
  markerDefs: React.PropTypes.array,
  dispatch: React.PropTypes.func,
};

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
