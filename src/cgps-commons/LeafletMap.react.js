import React from 'react';
import Leaflet from 'leaflet';
import { Map, TileLayer, Marker, PropTypes } from 'react-leaflet';
import MarkerLayer from 'react-leaflet-marker-layer';

import MapCluster from './LeafletMapCluster.react';
import MapLasso from './LeafletMapLasso.react';
import DefaultIcon from './LeafletMarkerDefaultIcon';

const ATTRIBUTION = `
  Map data &copy;
  <a href='http://openstreetmap.org'>OpenStreetMap</a> contributors,
  <a href='http://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>,
  Imagery © <a href='http://mapbox.com'>Mapbox</a>
`;

export default React.createClass({

  displayName: 'LeafletMap',

  propTypes: {
    height: React.PropTypes.number,
    width: React.PropTypes.number,
    className: React.PropTypes.string,
    markers: React.PropTypes.array,
    markerComponent: React.PropTypes.func,
    cluster: React.PropTypes.bool,
    center: PropTypes.latlng,
    zoom: React.PropTypes.number,
    highlightedColour: React.PropTypes.string,
    lassoPath: React.PropTypes.array,
    mapboxStyle: React.PropTypes.string,
    mapboxKey: React.PropTypes.string,
    lassoButtonClassname: React.PropTypes.string,
    onBoundsChange: React.PropTypes.func,
    onLassoPathChange: React.PropTypes.func,
  },

  getDefaultProps() {
    return {
      cluster: false,
    };
  },

  componentDidUpdate(prevProps) {
    if (prevProps.markers === null && this.props.markers) {
      this.refitMapBounds();
    }
  },

  componentWillUnmount() {
    const { onBoundsChange } = this.props;
    if (onBoundsChange && this.map) {
      const center = this.map.getCenter();
      const zoom = this.map.getZoom();
      onBoundsChange({ center, zoom });
    }
  },

  onClusterMarkerClick({ target, event }) {
    if (this.props.onMarkerClick) {
      this.props.onMarkerClick(target.options, event);
    }
  },

  onMarkerLayerClick({ marker, event }) {
    if (this.props.onMarkerClick) {
      this.props.onMarkerClick(marker, event);
    }
  },

  getBounds() {
    const { markers } = this.props;
    if (!markers || markers.length === 0) {
      return Leaflet.latLngBounds([ -85, -180 ], [ 85, 180 ]);
    }
    let north = -1000;
    let east = -1000;
    let south = 1000;
    let west = 1000;
    for (const { position } of markers) {
      if (Array.isArray(position)) {
        if (position[0] > north) north = position[0];
        if (position[0] < south) south = position[0];
        if (position[1] > east) east = position[1];
        if (position[1] < west) west = position[1];
      } else {
        if (position.latitude > north) north = position.latitude;
        if (position.latitude < south) south = position.latitude;
        if (position.longitude > east) east = position.longitude;
        if (position.longitude < west) west = position.longitude;
      }
    }
    const southWest = Leaflet.latLng([ south, west ]);
    const northEast = Leaflet.latLng([ north, east ]);
    return Leaflet.latLngBounds(southWest, northEast);
  },

  refitMapBounds(point) {
    if (point) {
      this.leafletMap.leafletElement.panTo(point);
    } else {
      this.leafletMap.leafletElement.fitBounds(this.getBounds());
    }
  },

  renderMarkers() {
    const { markers, cluster, markerComponent, highlightedColour } = this.props;

    if (!markers) return null;

    if (cluster) {
      return (
        <MapCluster
          markers={this.props.markers}
          onMarkerClick={this.onClusterMarkerClick}
        />
      );
    }

    if (markerComponent) {
      return (
        <MarkerLayer
          markers={markers}
          latitudeExtractor={({ position }) => position.latitude}
          longitudeExtractor={({ position }) => position.longitude}
          markerComponent={markerComponent}
          propsForMarkers={{ onClick: this.onMarkerLayerClick, highlightedColour }}
        />
      );
    }

    return markers.map(({ position, title, icon = DefaultIcon }, index) => (
      <Marker
        key={index}
        position={Array.isArray(position) ? position : [ position.latitude, position.longitude ]}
        title={title}
        icon={icon}
      />
    ));
  },

  render() {
    const { center, zoom, mapboxStyle, mapboxKey } = this.props;
    return (
      <Map
        animate={false}
        center={center}
        zoom={zoom}
        boundsOptions={{ animate: false }}
        className={this.props.className}
        onMoveend={({ target }) => { this.map = target; }}
        ref={(map) => { this.leafletMap = map; }}
      >
        <TileLayer
          attribution={ATTRIBUTION}
          url={`https://api.mapbox.com/styles/v1/mapbox/${mapboxStyle}/tiles/{z}/{x}/{y}?access_token=${mapboxKey}`}
        />
        { this.renderMarkers() }
        {/* {this.props.markers.map(({ position }) => <Marker position={[ position.latitude, position.longitude ]} />)} */}
        <MapLasso
          className={this.props.lassoButtonClassname}
          activeClassName="is-active"
          initialPath={this.props.lassoPath}
          onPathChange={this.props.onLassoPathChange}
        />
      </Map>
    );
  },

});
