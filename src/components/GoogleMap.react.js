/* global google */

import React from 'react';

import MapUtils from '../utils/Map';
import DEFAULT from '../defaults';

const mapStyle = {
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  minHeight: '100px',
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

// bound to a marker
function openInfoWindow(infoWindow) {
  if (currentInfoWindow) {
    currentInfoWindow.close();
  }
  infoWindow.open(map, this);
  currentInfoWindow = infoWindow;
}

function updateMarker(marker, { icon, active, infoWindow, onClick }) {
  marker.setOptions({
    icon: active ? icon : MapUtils.filteredMarkerIcon,
  });

  google.maps.event.clearListeners(marker, 'click');

  if (infoWindow) {
    marker.addListener('click', openInfoWindow.bind(
      marker, new google.maps.InfoWindow({ content: infoWindow })
    ));
  } else if (onClick) {
    marker.addListener('click', onClick);
  }
}

function createMarker({ position }) {
  const { latitude, longitude } = position;

  const marker = new google.maps.Marker({
    map,
    position: new google.maps.LatLng(
      parseFloat(latitude), parseFloat(longitude)
    ),
    optimized: false,
  });

  return marker;
}

function setMarkers(markerDefs) {
  for (let i = 0; i < markerDefs.length; i++) {
    const markerDef = markerDefs[i];

    if (!markers[i]) {
      markers.push(createMarker(markerDef));
    }

    updateMarker(markers[i], markerDef);
  }
}

function createMarkers(markerDefs) {
  for (const marker of markers) {
    marker.setMap(null);
  }
  markers.length = 0;

  setMarkers(markerDefs);
  fitAllMarkers();
}

function createMap({ onMapClick, markerDefs }) {
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

  if (onMapClick) {
    map.addListener('click', onMapClick);
  }

  createMarkers(markerDefs);
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
    resetMarkers: React.PropTypes.bool,
  },

  componentDidMount() {
    console.log('mount');
    createMap(this.props);
  },

  componentDidUpdate(previous) {
    if (!map) {
      createMap(this.props);
    }

    resizeMap();

    const { markerDefs } = this.props;
    if (this.props.resetMarkers) {
      console.log(markerDefs);
      createMarkers(markerDefs);
    } else if (markerDefs !== previous.markerDefs) {
      setMarkers(markerDefs);
    }
  },

  render() {
    return (
      <div id="map-canvas" style={mapStyle}></div>
    );
  },

});
