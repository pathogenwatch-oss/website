var React = require('react');
import MapUtils from '../../utils/Map';
import DEFAULT from '../../defaults';

var containerStyle = {
  margin: '0 0 25px 0',
  verticalAlign: 'top',
  textAlign: 'left'
};

var labelStyle = {
  fontSize: '15px',
  fontWeight: '300',
  lineHeight: '20px',
  textTransform: 'uppercase',
  color: '#777'
};

var Map = React.createClass({
  map: null,
  markers: {},
  infoWindow: null,
  infoWindowIsolates: null,

  propTypes: {
    locations: React.PropTypes.object.isRequired
  },

  componentDidMount: function () {
    this.initializeMap();
    this.createMarkers();
    this.resizeMap();
  },

  componentDidUpdate: function () {
    this.createMarkers();
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

  createMarkers: function () {
    this.clearMarkers();

    var latitude;
    var longitude;
    var shape;
    var colour;
    const locations = this.props.locations;

    for (const id in locations) {
      if (! locations[id]) {
        return;
      }

      if (locations[id].position.latitude && locations[id].position.longitude) {
        latitude = parseFloat(locations[id].position.latitude);
        longitude = parseFloat(locations[id].position.longitude);
        this.markers[id] = this.createMarker(id, locations[id].location, latitude, longitude);
      }
    };

    this.fitAllMarkers();
  },

  createMarker: function (dataObjectId, location = '', latitude, longitude, shape = DEFAULT.SHAPE, colour = DEFAULT.COLOUR) {
    if (!latitude) {
      throw new Error(`Can't create map marker because latitude is missing in ${dataObjectId} data object :(`);
    }

    if (!longitude) {
      throw new Error(`Can't create map marker because longitude is missing in ${dataObjectId} data object :(`);
    }

    if (shape === DEFAULT.SHAPE) {
      // console.warn(`Shape is missing in ${dataObjectId} data object - using ${DEFAULT.SHAPE}.`);
    }

    if (!colour) {
      console.warn(`Colour is missing in ${dataObjectId} data object - using ${DEFAULT.COLOUR}.`);
    }

    const marker = new google.maps.Marker({
      position: new google.maps.LatLng(latitude, longitude),
      map: this.map,
      // icon: MapUtils.getMarkerIcon(shape, colour),
      optimized: false,
    });
    var html = '<b>'+location+'</b>';
    var infowindow = new google.maps.InfoWindow({
      content: html
    });
    marker.addListener('mouseover', function() {
      infowindow.open(this.map, marker);
    });
    marker.addListener('mouseout', function() {
      infowindow.close(this.map, marker);
    });
    return marker;
  },

  render: function () {
    const mapStyle = {
      width: this.props.width,
      height: this.props.height,
    };

    return (
      <div>
        <div style={labelStyle}>{this.props.label}</div>
        <section id="map-canvas" style={mapStyle}></section>
      </div>
    );
  },

});

module.exports = Map;
