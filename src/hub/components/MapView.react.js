import '../css/map.css';

import React from 'react';
import { connect } from 'react-redux';

import LeafletMap from '../../cgps-commons/LeafletMap.react';

import CONFIG from '../../app/config';

import { getMarkers, getBounds, getLassoPath } from '../selectors/map';

import filterActions from '../actions';
import mapActions from '../actions/map';
import { showAssemblyDetails } from '../../assembly-drawer';

const lassoButtonClassname =
  'wgsa-map-lasso-button mdl-button mdl-button--fab mdl-button--mini-fab';

const MapView = React.createClass({

  displayName: 'MapView',

  propTypes: {
    markers: React.PropTypes.array,
    bounds: React.PropTypes.object,
    lassoPath: React.PropTypes.array,
    onBoundsChange: React.PropTypes.func,
    onLassoPathChange: React.PropTypes.func,
  },

  render() {
    const { center, zoom } = this.props.bounds || {};
    return (
      <div className="wgsa-filterable-content">
        <LeafletMap
          className="wgsa-hub-map-view"
          cluster markers={this.props.markers}
          mapboxStyle="light-v9"
          mapboxKey={CONFIG.mapboxKey}
          center={center}
          zoom={zoom}
          lassoPath={this.props.lassoPath}
          lassoButtonClassname={lassoButtonClassname}
          onBoundsChange={this.props.onBoundsChange}
          onLassoPathChange={this.props.onLassoPathChange}
          onMarkerClick={this.props.onMarkerClick}
        />
      </div>
    );
  },

});

function mapStateToProps(state) {
  return {
    markers: getMarkers(state),
    bounds: getBounds(state),
    lassoPath: getLassoPath(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onBoundsChange: bounds => dispatch(mapActions.storeBounds(bounds)),
    onLassoPathChange: path => dispatch(filterActions.filterByMetadata('area', path)),
    onMarkerClick: ({ id }) => dispatch(showAssemblyDetails(id)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MapView);
