import React from 'react';
import assign from 'object-assign';

import MapUtils from '../utils/Map';

import DEFAULT from '../defaults';
import ANTIBIOTICS from '../../static_data/antibiotics.json';


import PublicCollectionStore from '../stores/PublicCollectionStore';
import UploadedCollectionStore from '../stores/UploadedCollectionStore';
import MapStore from '../stores/MapStore';
import TableStore from '../stores/TableStore';

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
      assemblyIds: [],
    };
  },

  componentDidMount: function () {
    this.initializeMap();

    MapStore.addChangeListener(this.handleMapStoreChange);
    TableStore.addChangeListener(this.handleTableStoreChange);

    this.setState({
      assemblyIds: MapStore.getAssemblyIds(),
    });
  },

  componentWillUnmount: function () {
    MapStore.removeChangeListener(this.handleMapStoreChange);
    TableStore.removeChangeListener(this.handleTableStoreChange);
  },

  handleMapStoreChange: function () {
    this.setState({
      assemblyIds: MapStore.getAssemblyIds(),
    });
  },

  handleTableStoreChange: function () {
    this.createMarkers();
  },

  componentDidUpdate: function () {
    this.resizeMap();
    this.createMarkers();
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

      bounds.extend(marker.getPosition());
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
    var publicCollectionAssemblies = PublicCollectionStore.getPublicCollectionAssemblies();
    var uploadedCollectionAssemblies = UploadedCollectionStore.getUploadedCollectionAssemblies();
    return assign({}, publicCollectionAssemblies, uploadedCollectionAssemblies);
  },

  selectedTableColumnNameIsAntibiotic: function () {
    var selectedTableColumnName = TableStore.getColourTableColumnName();
    var listOfAntibiotics = Object.keys(ANTIBIOTICS);

    return (listOfAntibiotics.indexOf(selectedTableColumnName) > -1);
  },

  isAssemblyInPublicCollection: function (assemblyId) {
    var publicCollectionAssemblyIds = PublicCollectionStore.getPublicCollectionAssemblyIds();

    return (publicCollectionAssemblyIds.indexOf(assemblyId) > -1);
  },

  isAssemblyInUploadedCollection: function (assemblyId) {
    var uploadedCollectionAssemblyIds = UploadedCollectionStore.getUploadedCollectionAssemblyIds();

    return (uploadedCollectionAssemblyIds.indexOf(assemblyId) > -1);
  },

  getMarkerShapeForAssembly: function (assembly) {
    return 'circle';
  },

  getMarkerColourForAssembly: function (assembly) {
    var selectedTableColumnName = TableStore.getColourTableColumnName();
    var resistanceProfileResult;
    var colour = '#ffffff';

    if (this.selectedTableColumnNameIsAntibiotic()) {
      resistanceProfileResult = assembly.analysis.resistanceProfile[selectedTableColumnName].resistanceResult;

      if (resistanceProfileResult === 'RESISTANT') {
        colour = '#ff0000';
      } else {
        colour = '#ffffff';
      }
    } else if (this.isAssemblyInPublicCollection(assembly.metadata.assemblyId)) {
      colour = '#ffffff';
    } else if (this.isAssemblyInUploadedCollection(assembly.metadata.assemblyId)) {
      colour = DEFAULT.CGPS.COLOURS.PURPLE_LIGHT;
    }

    return colour;
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

      this.markers[assemblyId] = this.createMarker(assemblyId, latitude, longitude, shape, colour);
    });

    this.fitAllMarkers();
  },

  createMarker: function (dataObjectId, latitude, longitude, shape = DEFAULT.SHAPE, colour = DEFAULT.COLOUR) {
    if (!latitude) {
      throw new Error(`Can't create map marker because latitude is missing in ${dataObjectId} data object :(`);
    }

    if (!longitude) {
      throw new Error(`Can't create map marker because longitude is missing in ${dataObjectId} data object :(`);
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
