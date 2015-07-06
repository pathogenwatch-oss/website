var React = require('react');
var InfoWindow = require('./InfoWindow.react');
var MapUtils = require('../utils/Map');
var TimelineUtils = require('../utils/Timeline');
var DataUtils = require('../utils/Data');
var TreeUtils = require('../utils/Tree');
var DEFAULT = require('../defaults');

var SpeciesSubtreeStore = require('../stores/SpeciesSubtreeStore');
var PublicCollectionStore = require('../stores/PublicCollectionStore');
var UploadedCollectionStore = require('../stores/UploadedCollectionStore');

var Map = React.createClass({

  data: null,

  map: null,
  markers: {},
  infoWindow: null,
  infoWindowIsolates: null,

  propTypes: {
    width: React.PropTypes.number.isRequired,
    height: React.PropTypes.number.isRequired,
    filteredMapData: React.PropTypes.object.isRequired,
    filterStartDate: React.PropTypes.object,
    filterEndDate: React.PropTypes.object
  },

  getInitialState: function () {
    return {
      assemblyIds: []
    };
  },

  componentDidMount: function () {
    // this.setData();
    this.initializeMap();
    // this.dangerouslyListenToInfoWindowIsolateClick();

    this.setAssemblyIdsFromActiveSpeciesSubtree();

    SpeciesSubtreeStore.addChangeListener(this.setAssemblyIdsFromActiveSpeciesSubtree);
  },

  setAssemblyIdsFromActiveSpeciesSubtree: function () {
    var activeSpeciesSubtreeId = SpeciesSubtreeStore.getActiveSpeciesSubtreeId();
    var activeSpeciesSubtree = SpeciesSubtreeStore.getActiveSpeciesSubtree();
    var assemblyIdsFromSpeciesSubtree = [];

    var uploadedCollectionId = UploadedCollectionStore.getUploadedCollection().collectionId;

    if (activeSpeciesSubtreeId === uploadedCollectionId) {

      assemblyIdsFromSpeciesSubtree = TreeUtils.extractIdsFromNewick(UploadedCollectionStore.getUploadedCollectionTree());

    } else if (activeSpeciesSubtree) {

      assemblyIdsFromSpeciesSubtree = TreeUtils.extractIdsFromNewick(activeSpeciesSubtree);

    } else {

      assemblyIdsFromSpeciesSubtree = [];

    }

    this.setState({
      assemblyIds: assemblyIdsFromSpeciesSubtree
    });
  },

  // shouldComponentUpdate: function (nextProps) {
  //   var currentFilteredMapData = this.props.filteredMapData;
  //   var nextFilteredMapData = nextProps.filteredMapData;
  //
  //   var currentWidthHeightObject = {
  //     width: this.props.width,
  //     height: this.props.height
  //   };
  //   var nextWidthHeightObject = {
  //     width: nextProps.width,
  //     height: nextProps.height
  //   };
  //
  //   var currentColourDataByDataField = this.props.colourDataByDataField;
  //   var nextColourDataByDataField = nextProps.colourDataByDataField;
  //
  //   var currentFilterStartDate = this.props.filterStartDate;
  //   var nextFilterStartDate = nextProps.filterStartDate;
  //
  //   var currentFilterEndDate = this.props.filterEndDate;
  //   var nextFilterEndDate = nextProps.filterEndDate;
  //
  //   if (! this.isEqualObjects(currentFilteredMapData, nextFilteredMapData)) {
  //     return true;
  //   }
  //
  //   if (! this.isEqualObjects(currentWidthHeightObject, nextWidthHeightObject)) {
  //     return true;
  //   }
  //
  //   if (currentColourDataByDataField !== nextColourDataByDataField) {
  //     return true;
  //   }
  //
  //   if (currentFilterStartDate !== nextFilterStartDate) {
  //     return true;
  //   }
  //
  //   if (currentFilterEndDate !== nextFilterEndDate) {
  //     return true;
  //   }
  //
  //   return false;
  // },

  componentDidUpdate: function () {

    // this.setData();
    this.resizeMap();
    this.createMarkers();
  },

  // setData: function () {
  //   var startDate = this.props.filterStartDate;
  //   var endDate = this.props.filterEndDate;
  //
  //   this.data = this.props.filteredMapData;
  //   this.data = MapUtils.getDataObjectsWithCoordinates(this.data);
  //   this.data = TimelineUtils.getDataObjectsWithinDateRange(startDate, endDate, this.data);
  // },

  isEqualObjects: function (firstObject, secondObject) {
    return (JSON.stringify(firstObject) === JSON.stringify(secondObject));
  },

  dangerouslyListenToInfoWindowIsolateClick: function () {
    var _this = this;

    $('body').on('click', '[data-info-window-isolate]', function (event) {
      event.preventDefault();

      var isolateId = $(this).attr('data-info-window-isolate-id');
      _this.handleInfoWindowIsolateClick(isolateId);
    });
  },

  handleInfoWindowIsolateClick: function (isolateId) {
    this.props.handleInfoWindowIsolateClick(isolateId);
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
      styles: [{'featureType':'landscape','stylers':[{'saturation':-100},{'lightness':65},{'visibility':'on'}]},{'featureType':'poi','stylers':[{'saturation':-100},{'lightness':51},{'visibility':'simplified'}]},{'featureType':'road.highway','stylers':[{'saturation':-100},{'visibility':'simplified'}]},{'featureType':'road.arterial','stylers':[{'saturation':-100},{'lightness':30},{'visibility':'on'}]},{'featureType':'road.local','stylers':[{'saturation':-100},{'lightness':40},{'visibility':'on'}]},{'featureType':'transit','stylers':[{'saturation':-100},{'visibility':'simplified'}]},{'featureType':'administrative.province','stylers':[{'visibility':'off'}]},{'featureType':'water','elementType':'labels','stylers':[{'visibility':'on'},{'lightness':-25},{'saturation':-100}]},{'featureType':'water','elementType':'geometry','stylers':[{'hue':'#ffff00'},{'lightness':-25},{'saturation':-97}]}],
      streetViewControl: false,
      scaleControl: true,
      mapTypeId: google.maps.MapTypeId.TERRAIN
    };

    this.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    this.createMarkers();
    //this.createInfoWindow();
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

  createMarkers: function () {

    this.clearMarkers();

    var markers = [];
    var publicCollection = PublicCollectionStore.getPublicCollection();
    var uploadedCollection = UploadedCollectionStore.getUploadedCollection();
    var assembly;
    var latitude;
    var longitude;
    var shape;
    var colour;
    var marker;

    this.state.assemblyIds.forEach(function (assemblyId) {

      assembly = publicCollection.assemblies[assemblyId];

      if (! assembly) {
        return;
      }

      latitude = parseFloat(assembly.latitude);
      longitude = parseFloat(assembly.longitude);
      shape = 'square';
      colour = '#ffffff';

      marker = this.createMarker(assemblyId, latitude, longitude, shape, colour);

      this.markers[assemblyId] = marker;
    }.bind(this));

    this.state.assemblyIds.forEach(function (assemblyId) {

      assembly = uploadedCollection.assemblies[assemblyId];

      if (! assembly) {
        return;
      }

      latitude = parseFloat(assembly.latitude);
      longitude = parseFloat(assembly.longitude);
      shape = 'square';
      colour = '#000000';

      marker = this.createMarker(assemblyId, latitude, longitude, shape, colour);

      this.markers[assemblyId] = marker;
    }.bind(this));

    this.fitAllMarkers();
  },

  __createMarkers: function () {
    var isolates = this.data;

    var isolatesGroupedByPosition = MapUtils.groupDataObjectsByPosition(isolates);
    var isolatePositionKeys = Object.keys(isolatesGroupedByPosition);

    var columnName = this.props.colourDataByDataField;
    var isolateIds = Object.keys(isolates);
    var markers = {};
    var marker;
    var latitude;
    var longitude;
    var shape;
    var colour;
    var isolate;
    var isolateId;
    var isolatePositionKey;
    var isolateGroup;
    var isolateGroupHasManyItems;

    this.clearMarkers();

    isolatePositionKeys.forEach(function (isolatePositionKey) {

      isolateGroup = isolatesGroupedByPosition[isolatePositionKey];
      isolate = isolateGroup[0];
      isolateId = DataUtils.getDataObject__Id(isolate);

      latitude = isolate.__latitude;
      longitude = isolate.__longitude;

      isolateGroupHasManyItems = (isolateGroup.length > 1);

      if (! columnName) {

        shape = DEFAULT.SHAPE;
        colour = DEFAULT.COLOUR;

      } else {

        if (isolateGroupHasManyItems) {

          if (isolate[columnName + '__groupcolour'] || isolate[columnName + '__groupcolor']) {

            colour = isolate[columnName + '__groupcolour'] || isolate[columnName + '__groupcolor'];

          } else {

            colour = isolate[columnName + '__colour'] || isolate[columnName + '__color'];

          }

        } else {

          colour = isolate[columnName + '__colour'] || isolate[columnName + '__color'];
        }

        shape = isolate[columnName + '__shape'];
      }

      marker = this.createMarker(isolateId, latitude, longitude, shape, colour);
      isolatePositionKey = MapUtils.getPositionKey(latitude, longitude);

      markers[isolatePositionKey] = marker;

      this.listenToMarkerClick(marker, latitude, longitude);

    }.bind(this));

    this.markers = markers;
  },

  listenToMarkerClick: function (marker, latitude, longitude) {
    google.maps.event.addListener(marker, 'click', function () {
      this.handleMarkerClick(latitude, longitude);
    }.bind(this));
  },

  handleMarkerClick: function (latitude, longitude) {
    var isolatePositionKey = MapUtils.getPositionKey(latitude, longitude);
    var isolatesGroupedByPosition = MapUtils.groupDataObjectsByPosition(this.data);
    var isolates = isolatesGroupedByPosition[isolatePositionKey];
    var isolateIds = isolates.map(function (isolate) {
      return DataUtils.getDataObject__Id(isolate);
    });

    this.openInfoWindow(latitude, longitude);
    this.props.handleFilterData(isolateIds);
  },

  openInfoWindow: function (latitude, longitude) {
    var isolatePositionKey = MapUtils.getPositionKey(latitude, longitude);
    var isolatesGroupedByPosition = MapUtils.groupDataObjectsByPosition(this.data);
    var isolates = isolatesGroupedByPosition[isolatePositionKey];
    var marker = this.markers[isolatePositionKey];
    var infoWindow = this.infoWindow;
    var infoWindowContent = this.getInfoWindowContent(isolates);

    this.infoWindowIsolates = isolates;

    infoWindow.setContent(infoWindowContent);
    infoWindow.open(this.map, marker);
  },

  createMarker: function (dataObjectId, latitude, longitude, shape, colour) {

    if (typeof latitude === 'undefined') {
      throw new Error("Can't create map marker because latitude is missing in " + dataObjectId + " data object.");
    }

    if (typeof latitude !== 'number') {
      throw new Error("__latitude in data object with id " + dataObjectId + " is not a number, but a " + typeof latitude + '.');
    }

    if (typeof longitude === 'undefined') {
      throw new Error("Can't create map marker because longitude is missing in " + dataObjectId + " data object.");
    }

    if (typeof longitude !== 'number') {
      throw new Error("__longitude in data object with id " + dataObjectId + " is not a number.");
    }

    if (! shape) {
      shape = DEFAULT.SHAPE;
      console.warn("Shape is missing in " + dataObjectId + " data object - using " + DEFAULT.SHAPE + ".");
    }

    if (! colour) {
      colour = DEFAULT.COLOUR;
      console.warn("Colour is missing in " + dataObjectId + " data object - using " + DEFAULT.COLOUR + ".");
    }

    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(latitude, longitude),
      map: this.map,
      icon: MapUtils.getMarkerIcon(shape, colour),
      optimized: false
    });

    return marker;
  },

  createInfoWindow: function () {
    var infoWindow = new google.maps.InfoWindow({
      content: ''
    });

    google.maps.event.addListener(infoWindow, 'closeclick', this.handleCloseInfoWindow);

    this.infoWindow = infoWindow;
  },

  handleCloseInfoWindow: function () {
    this.syncTableDataWithMapData();
  },

  syncTableDataWithMapData: function () {
    var isolates = this.props.filteredMapData;
    var isolateIds = Object.keys(isolates);

    this.props.handleFilterData(isolateIds);
  },

  getInfoWindowContent: function (isolates) {
    return (React.renderToString(<InfoWindow isolates={isolates} />));
  },

  render: function () {
    var mapStyle = {
      width: this.props.width,
      height: this.props.height
    };

    return (
      <section id="map-canvas" style={mapStyle}></section>
    );
  }
});

module.exports = Map;
