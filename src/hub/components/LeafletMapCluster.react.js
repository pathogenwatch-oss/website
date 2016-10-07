/* global L */

import React from 'react';
import Leaflet from 'leaflet';
import { MapLayer } from 'react-leaflet';
import 'leaflet.markercluster';

const icon = Leaflet.divIcon({
  className: 'material-icons',
  html: 'place',
  iconSize: [ 40, 40 ],
  iconAnchor: [ 20, 37 ],
  popupAnchor: [ 0, -32 ],
});

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

    const layers = markers.map(({ position, label }) =>
      Leaflet.marker(position, { icon }).bindPopup(label)
    );

    this.leafletElement.eachLayer(this.removeMarker.bind(this));

    this.leafletElement.addLayers(layers);
  }

  removeMarker(marker) {
    if (marker.options.icon === icon) {
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
};

MarkerCluster.defaultProps = {
  markers: [],
};

export default MarkerCluster;
