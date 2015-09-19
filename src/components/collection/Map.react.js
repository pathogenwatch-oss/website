import React from 'react';

import UploadWorkspaceNavigationActionCreators from '../../actions/UploadWorkspaceNavigationActionCreators.js';

import MapUtils from '../../utils/Map';
import DEFAULT from '../../defaults';

const Map = React.createClass({
  map: null,
  markers: {},
  infoWindow: null,
  infoWindowIsolates: null,

  componentDidMount: function () {
    this.initializeMap();
    this.initializeAndCreateMarkers();
    this.resizeMap();
  },

  componentDidUpdate: function () {
    this.initializeAndCreateMarkers();
    this.resizeMap();
  },

  resizeMap: function () {
    var center = this.map.getCenter();
    google.maps.event.trigger(this.map, 'resize');
    this.map.setCenter(center);
  },

  initializeMap: function () {
    var center = new google.maps.LatLng(DEFAULT.MAP.CENTER.LATITUDE, DEFAULT.MAP.CENTER.LONGITUDE);

    var mapOptions = {
      center: center,
      // styles: MapUtils.STYLES,
      streetViewControl: false,
      scaleControl: true,
      mapTypeId: google.maps.MapTypeId.TERRAIN,
      zoom: 3,
    };

    this.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
  },

  fitAllMarkers: function () {
    if (Object.keys(this.markers).length === 0) {
      return;
    }

    var bounds = new google.maps.LatLngBounds();
    var markers = this.markers;
    var markerIds = Object.keys(markers);
    var marker;

    markerIds.forEach(function (markerId) {
      marker = markers[markerId];
      bounds.extend(marker.getPosition());
    });

    this.map.fitBounds(bounds);
    this.map.setZoom(3);
  },

  clearMarkers: function () {
    var markers = this.markers;
    var markerIds = Object.keys(markers);

    markerIds.forEach(this.clearMarker);

    this.markers = {};
  },

  clearMarker: function (markerId) {
    var marker = this.markers[markerId];
    marker.setMap(null);
  },

  initializeAndCreateMarkers: function() {
    var locations = {};
    if (this.props.locations) {
      locations = this.props.locations;
      this.createMarkers(locations);
    }
    else if (this.props.locationAssemblyMap) {
      locations = this.props.locationAssemblyMap;
      this.createMarkersOverview(locations);
    }
  },

  createMarkers: function (locations) {
    this.clearMarkers();

    var latitude;
    var longitude;
    var shape;
    var colour;

    for (const id in locations) {
      if (! locations[id]) {
        return;
      }

      latitude = locations[id].position.latitude;
      longitude = locations[id].position.longitude;

      if (latitude && longitude) {
        latitude = parseFloat(latitude);
        longitude = parseFloat(longitude);
        this.markers[id] = this.createMarker(locations[id].assemblyName, locations[id].location, latitude, longitude);
      }
    };

    this.fitAllMarkers();
  },

  createMarkersOverview: function (locations) {
    this.clearMarkers();

    var latitude;
    var longitude;
    var shape;
    var colour;

    var temp_loc;
    for (const id in locations) {
      if (! locations[id]) {
        return;
      }
      temp_loc = id.split(',');
      latitude = temp_loc[0];
      longitude = temp_loc[1];

      if (latitude && longitude) {
        latitude = parseFloat(latitude);
        longitude = parseFloat(longitude);
        this.markers[id] = this.createMarker(locations[id].assemblyName, locations[id].location, latitude, longitude);
      }
    };

    this.fitAllMarkers();
  },

  createMarker: function (dataObject = [], location = '', latitude, longitude, shape = DEFAULT.SHAPE, colour = DEFAULT.CGPS.COLOURS.PURPLE_LIGHT) {

    if (!latitude && !longitude) {
      throw new Error(`Can't create map marker because latitude and longitude is missing in ${location} data object :(`);
    }

    if (!colour) {
      console.warn(`Colour is missing in ${location} data object - using ${DEFAULT.COLOUR}.`);
    }

    const marker = new google.maps.Marker({
      position: new google.maps.LatLng(latitude, longitude),
      map: this.map,
      icon: MapUtils.getMarkerIcon(shape, colour),
      optimized: false,
      // animation: google.maps.Animation.DROP
    });

    var infowindow;
    var html = '';
    if (dataObject.length) {
      html = createLink(dataObject);
      infowindow = new google.maps.InfoWindow({
        content: html
      });
    }
    else if (location) {
      html = '<b>'+location+'</b>';
      infowindow = new google.maps.InfoWindow({
        content: html
      });
    }

    marker.addListener('click', function() {
      infowindow.open(this.map, marker);
    });
    return marker;
  },

  render: function () {
    const mapStyle = {
      // position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      height: this.props.height || '200px',
      width: this.props.width || '200px',
    };

    return (
      <fieldset className="metadata-field__map">
        <section id="map-canvas" style={mapStyle}></section>
      </fieldset>
    );
  },

});

function handleSelectAssembly(selectedassemblyName) {
  UploadWorkspaceNavigationActionCreators.navigateToAssembly(selectedassemblyName);
}

function createLink(dataObject) {
  const div = document.createElement('div');
  div.style.paddingRight = '15px';
  dataObject.map(function (assemblyName) {
    const button = document.createElement('button');
    const textNode = document.createTextNode(assemblyName);
    const br = document.createElement('br');
    button.appendChild(textNode);
    button.className = 'mdl-button mdl-js-button mdl-js-ripple-effect';
    button.style.textTransform = 'none';
    button.onclick = handleSelectAssembly.bind(null, assemblyName);
    componentHandler.upgradeElement(button);
    div.appendChild(button);
    div.appendChild(br);
  });
  return div;
}

module.exports = Map;
