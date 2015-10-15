/* global google */

import React from 'react';
import assign from 'object-assign';

import ReferenceCollectionStore from '../../stores/ReferenceCollectionStore';
import UploadedCollectionStore from '../../stores/UploadedCollectionStore';

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
let infoWindow = null;
let infoWindowIsolates = null;

function resizeMap() {
  const center = map.getCenter();
  google.maps.event.trigger(map, 'resize');
  map.setCenter(center);
}

function fitAllMarkers() {
  if (markers.length === 0) {
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

function getAllAssemblies() {
  return assign({},
    ReferenceCollectionStore.getAssemblies(),
    UploadedCollectionStore.getAssemblies()
  );
}

function createMarker({ latitude, longitude }, icon, onClick) {
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

  marker.addListener('click', onClick);

  return marker;
}

function createMarkers(assemblyIds, onClick) {
  clearMarkers();

  const combinedAssemblies = getAllAssemblies();

  const positionMap = new Map();
  for (const assemblyId of assemblyIds) {
    const assembly = combinedAssemblies[assemblyId];

    if (!assembly) {
      return;
    }

    const position = JSON.stringify(assembly.metadata.geography.position);
    if (positionMap.has(position)) {
      const ids = positionMap.get(position);
      ids.push(assemblyId);
    } else {
      positionMap.set(position, [ assemblyId ])
    }
  }

  const retrieveAssembly = (id) => combinedAssemblies[id];
  for (const [ position, ids ] of positionMap) {
    const marker = createMarker(
      JSON.parse(position),
      MapUtils.getMarkerIcon(ids.map(retrieveAssembly)),
      onClick.bind(null, ids)
    );

    if (marker) {
      markers.push(marker);
    }
  }

  fitAllMarkers();
}

export default React.createClass({

  propTypes: {
    assemblyIds: React.PropTypes.array,
    onMapClick: React.PropTypes.func,
    onMarkerClick: React.PropTypes.func,
  },

  componentDidMount() {
    const center = new google.maps.LatLng(
      DEFAULT.MAP.CENTER.LATITUDE, DEFAULT.MAP.CENTER.LONGITUDE
    );

    map = new google.maps.Map(document.getElementById('map-canvas'), {
      zoom: 4,
      center,
      streetViewControl: false,
      scaleControl: true,
      mapTypeId: google.maps.MapTypeId.TERRAIN,
    });

    if (this.props.onMapClick) {
      map.addListener('click', this.props.onMapClick);
    }

    createMarkers(this.props.assemblyIds, this.props.onMarkerClick);
  },

  componentDidUpdate() {
    resizeMap();
    createMarkers(this.props.assemblyIds, this.props.onMarkerClick);
  },

  render() {
    return (
      <div id="map-canvas" style={mapStyle}></div>
    );
  },

});
