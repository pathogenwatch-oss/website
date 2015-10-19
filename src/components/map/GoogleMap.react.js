/* global google */

import React from 'react';

import MapUtils from '../../utils/Map';
import DEFAULT from '../../defaults';

const mapStyle = {
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
};

// module state
let map = null;
const markers = [];
let currentInfoWindow = null;

function resizeMap() {
  const center = map.getCenter();
  google.maps.event.trigger(map, 'resize');
  map.setCenter(center);
}

function fitAllMarkers() {
  if (markers.length === 0) {
    return;
  }

  if (markers.length === 1) {
    map.setCenter(markers[0].getPosition());
    return;
  }

  const bounds = new google.maps.LatLngBounds();

  for (const marker of markers) {
    bounds.extend(marker.getPosition());
  }

  const zoom = map.getZoom();
  map.fitBounds(bounds);
  // zoom out if necessary
  if (map.getZoom() > zoom) {
    map.setZoom(zoom);
  }
}

function clearMarkers() {
  for (const marker of markers) {
    marker.setMap(null);
  }
  markers.length = 0;
}

// bound to a marker
function openInfoWindow(infoWindow) {
  if (currentInfoWindow) {
    currentInfoWindow.close();
  }
  infoWindow.open(map, this);
  currentInfoWindow = infoWindow;
}

function createMarker({ position, icon = MapUtils.standardMarkerIcon, onClick, infoWindow }) {
  const { latitude, longitude } = position;
  if (!latitude || !longitude) {
    return null;
  }

  const marker = new google.maps.Marker({
    position: new google.maps.LatLng(
      parseFloat(latitude), parseFloat(longitude)
    ),
    map,
    icon,
    optimized: false,
  });

  if (infoWindow) {
    marker.addListener('click', openInfoWindow.bind(
      marker, new google.maps.InfoWindow({ content: infoWindow })
    ));
  } else if (onClick) {
    marker.addListener('click', onClick);
  }

  return marker;
}

function createMarkers(markerDefs) {
  clearMarkers();

  for (const definition of markerDefs) {
    const marker = createMarker(definition);
    if (marker) {
      markers.push(marker);
    }
  }

  fitAllMarkers();
}

export default React.createClass({

  displayName: 'GoogleMap',

  propTypes: {
    markerDefs: React.PropTypes.arrayOf(
      React.PropTypes.shape({
        position: React.PropTypes.object,
        icon: React.PropTypes.string,
        onClick: React.PropTypes.func,
      })
    ),
    onMapClick: React.PropTypes.func,
  },

  componentDidMount() {
    const center = new google.maps.LatLng(
      DEFAULT.MAP.CENTER.LATITUDE, DEFAULT.MAP.CENTER.LONGITUDE
    );

    map = new google.maps.Map(document.getElementById('map-canvas'), {
      center,
      streetViewControl: false,
      scaleControl: true,
      mapTypeControl: false,
      mapTypeId: google.maps.MapTypeId.TERRAIN,
      zoom: 4,
    });

    if (this.props.onMapClick) {
      map.addListener('click', this.props.onMapClick);
    }

    createMarkers(this.props.markerDefs);
  },

  componentDidUpdate() {
    resizeMap();
    createMarkers(this.props.markerDefs);
  },

  render() {
    return (
      <div id="map-canvas" style={mapStyle}></div>
    );
  },

});
