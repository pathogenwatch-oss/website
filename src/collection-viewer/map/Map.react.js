import React from 'react';
import { connect } from 'react-redux';

import LeafletMap from '../../cgps-commons/LeafletMap.react';

import { getMarkers } from './selectors';

import CONFIG from '../../app/config';

import {
  activateFilter,
  appendToFilter,
  removeFromFilter,
  resetFilter,
} from '../../actions/filter';

const ExplorerMap = ({ markers }) => (
  // <section style={style}>
  <LeafletMap
    className="wgsa-hub-map-view"
    markers={markers}
    mapboxStyle="light-v9"
    mapboxKey={CONFIG.mapboxKey}
    center={[ 0, 0 ]}
    zoom={1}
    // lassoPath={this.props.lassoPath}
    // lassoButtonClassname={lassoButtonClassname}
    // onBoundsChange={this.props.onBoundsChange}
    // onLassoPathChange={this.props.onLassoPathChange}
    // onMarkerClick={this.props.onMarkerClick}
  />
  // </section>
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
    onMarkerClick: () => dispatch(resetFilter()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ExplorerMap);
