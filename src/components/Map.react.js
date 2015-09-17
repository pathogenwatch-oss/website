import React from 'react';
import assign from 'object-assign';

import ReferenceCollectionStore from '../stores/ReferenceCollectionStore';
import UploadedCollectionStore from '../stores/UploadedCollectionStore';
import FilteredDataStore from '../stores/FilteredDataStore';

import MapUtils from '../utils/Map';
import FilteredDataUtils from '../utils/FilteredData';

import DEFAULT from '../defaults';

const Map = React.createClass({
  map: null,
  markers: {},
  infoWindow: null,
  infoWindowIsolates: null,

  propTypes: {
    width: React.PropTypes.number.isRequired,
    height: React.PropTypes.number.isRequired,
  },

  getInitialState: function () {
    return {
      assemblyIds: FilteredDataStore.getAssemblyIds(),
    };
  },

  componentDidMount: function () {
    this.initializeMap();

    FilteredDataStore.addChangeListener(this.handleFilteredDataStoreChange);
  },

  componentDidUpdate: function () {
    this.resizeMap();
    this.createMarkers();
  },

  componentWillUnmount: function () {
    FilteredDataStore.removeChangeListener(this.handleFilteredDataStoreChange);
  },

  handleFilteredDataStoreChange: function () {
    this.setState({
      assemblyIds: FilteredDataStore.getAssemblyIds(),
    });
  },

  resizeMap: function () {
    var center = this.map.getCenter();
    google.maps.event.trigger(this.map, 'resize');
    this.map.setCenter(center);
  },

  initializeMap: function () {
    var center = new google.maps.LatLng(DEFAULT.MAP.CENTER.LATITUDE, DEFAULT.MAP.CENTER.LONGITUDE);

    var mapOptions = {
      zoom: 4,
      center: center,
      // styles: MapUtils.STYLES,
      streetViewControl: false,
      scaleControl: true,
      mapTypeId: google.maps.MapTypeId.TERRAIN,
    };

    this.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    this.createMarkers();
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
      if (marker) {
        bounds.extend(marker.getPosition());
      }
    });

    this.map.fitBounds(bounds);
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

  getCombinedPublicAndUploadedCollectionAssemblies: function () {
    var referenceCollectionAssemblies = ReferenceCollectionStore.getAssemblies();
    var uploadedCollectionAssemblies = UploadedCollectionStore.getAssemblies();
    return assign({}, referenceCollectionAssemblies, uploadedCollectionAssemblies);
  },

  getMarkerShapeForAssembly: function (assembly) {
    return 'circle';
  },

  getMarkerColourForAssembly: function (assembly) {
    return FilteredDataUtils.getColour(assembly);
  },

  createMarkers: function () {
    this.clearMarkers();

    var combinedAssemblies = this.getCombinedPublicAndUploadedCollectionAssemblies();
    var assembly;
    var latitude;
    var longitude;
    var shape;
    var colour;

    this.state.assemblyIds.forEach((assemblyId) => {
      assembly = combinedAssemblies[assemblyId];

      if (! assembly) {
        return;
      }

      latitude = parseFloat(assembly.metadata.geography.position.latitude);
      longitude = parseFloat(assembly.metadata.geography.position.longitude);

      shape = this.getMarkerShapeForAssembly(assembly);
      colour = this.getMarkerColourForAssembly(assembly);

      const marker = this.createMarker(assemblyId, latitude, longitude, shape, colour);
      if (marker) {
        this.markers[assemblyId] = marker;
      }
    });

    this.fitAllMarkers();
  },

  createMarker: function (dataObjectId, latitude, longitude, shape = DEFAULT.SHAPE, colour = DEFAULT.COLOUR) {
    if (!latitude || !longitude) {
      return null;
    }

    if (shape === DEFAULT.SHAPE) {
      console.warn(`Shape is missing in ${dataObjectId} data object - using ${DEFAULT.SHAPE}.`);
    }

    if (!colour) {
      console.warn(`Colour is missing in ${dataObjectId} data object - using ${DEFAULT.COLOUR}.`);
    }

    const marker = new google.maps.Marker({
      position: new google.maps.LatLng(latitude, longitude),
      map: this.map,
      icon: MapUtils.getMarkerIcon(shape, colour),
      optimized: false,
    });

    return marker;
  },

  render: function () {
    const mapStyle = {
      width: this.props.width,
      height: this.props.height,
    };

    return (
      <section id="map-canvas" style={mapStyle}></section>
    );
  },

});

module.exports = Map;
