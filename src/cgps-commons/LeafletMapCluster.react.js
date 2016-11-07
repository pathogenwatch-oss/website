/* global L */

import React from 'react';
import Leaflet from 'leaflet';
import { MapLayer } from 'react-leaflet';
import 'leaflet.markercluster';

const layerId = {};

import defaultIcon from './LeafletMarkerDefaultIcon';

class MarkerCluster extends MapLayer {

  componentWillMount() {
    super.componentWillMount();
    this.leafletElement = Leaflet.markerClusterGroup();
  }

  componentDidMount() {
    super.componentDidMount();
    this.addMarkers(this.props.markers);
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.markers !== this.props.markers;
  }

  componentDidUpdate() {
    this.addMarkers(this.props.markers);
  }

  addMarkers(markers) {
    if (!Array.isArray(markers) || markers.length === 0) {
      return;
    }

    const layers = markers.map(({ id, position, title, icon = defaultIcon }) =>
      Leaflet.marker(position, { id, icon, title, layerId }).
        on('click', this.props.onMarkerClick)
    );

    this.leafletElement.eachLayer(this.removeMarker.bind(this));

    this.leafletElement.addLayers(layers);
  }

  removeMarker(marker) {
    if (marker.options.layerId === layerId) {
      this.leafletElement.removeLayer(marker);
    }
  }

  render() {
    return null;
  }
}

MarkerCluster.propTypes = {
  map: React.PropTypes.object,
  markers: React.PropTypes.array,
  onMarkerClick: React.PropTypes.func,
};

MarkerCluster.defaultProps = {
  markers: [],
};

export default MarkerCluster;
