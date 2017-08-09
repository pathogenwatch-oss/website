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
    this.leafletElement = Leaflet.markerClusterGroup(this.props.options);
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
    const layers = this.leafletElement.getLayers();
    for (const layer of layers) {
      if (layer.options.layerId === layerId) {
        this.leafletElement.removeLayer(layer);
      }
    }

    if (!Array.isArray(markers) || markers.length === 0) {
      return;
    }

    const newLayers = [];

    for (const { id, latitude, longitude, title, icon = defaultIcon } of markers) {
      if (latitude && longitude) {
        newLayers.push(
          Leaflet.marker([ latitude, longitude ], { id, icon, title, layerId })
            // .on('click', this.props.onMarkerClick)
        );
      }
    }

    this.leafletElement.addLayers(newLayers);
  }

  render() {
    return null;
  }
}

MarkerCluster.propTypes = {
  map: React.PropTypes.object,
  markers: React.PropTypes.array,
  onMarkerClick: React.PropTypes.func,
  options: React.PropTypes.object,
};

MarkerCluster.defaultProps = {
  markers: [],
  options: {},
};

export default MarkerCluster;
