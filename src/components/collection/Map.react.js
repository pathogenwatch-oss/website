var React = require('react');
import MapUtils from '../../utils/Map';
import DEFAULT from '../../defaults';
import UploadWorkspaceNavigationActionCreators from '../../actions/UploadWorkspaceNavigationActionCreators.js';

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
    const locations = this.props.locationAssemblyMap;
    var temp_loc;
    for (const id in locations) {
      if (! locations[id]) {
        return;
      }
      temp_loc = id.split(',');
      latitude = temp_loc[0];
      longitude = temp_loc[1]

      if (latitude && longitude) {
        latitude = parseFloat(latitude);
        longitude = parseFloat(longitude);
        this.markers[id] = this.createMarker(locations[id].fileAssemblyId, locations[id].location, latitude, longitude);
      }
    };

    this.fitAllMarkers();
  },

  createMarker: function (dataObject = [], location = '', latitude, longitude, shape = DEFAULT.SHAPE, colour = DEFAULT.COLOUR) {

    if (!latitude && !longitude) {
      throw new Error(`Can't create map marker because latitude and longitude is missing in ${location} data object :(`);
    }

    if (shape === DEFAULT.SHAPE) {
      // console.warn(`Shape is missing in ${location} data object - using ${DEFAULT.SHAPE}.`);
    }

    if (!colour) {
      console.warn(`Colour is missing in ${location} data object - using ${DEFAULT.COLOUR}.`);
    }

    const marker = new google.maps.Marker({
      position: new google.maps.LatLng(latitude, longitude),
      map: this.map,
      // icon: MapUtils.getMarkerIcon(shape, colour),
      optimized: false,
      animation: google.maps.Animation.DROP
    });

    var infowindow;
    var html = '';
    if (dataObject.length) {
      dataObject.map(function(data) {
        html = createLink(data);
      });
      console.log(html)

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

function handleSelectAssembly(selectedFileAssemblyId) {
  console.log(selectedFileAssemblyId)
  UploadWorkspaceNavigationActionCreators.navigateToAssembly(selectedFileAssemblyId);
};

var createLink = function(fileAssemblyId) {

    var a = document.createElement('a');
    a.href = '#';
    a.onclick = handleSelectAssembly.bind(null, fileAssemblyId);
    a.innerHTML = fileAssemblyId;
    console.log(a)
    return a;

  // `
  //   <a className='mdl-button mdl-js-button mdl-js-ripple-effect'
  //     onClick={handleSelectAssembly(fileAssemblyId)} href="#">
  //     ${fileAssemblyId}
  //   </a><br>`;
}

module.exports = Map;
