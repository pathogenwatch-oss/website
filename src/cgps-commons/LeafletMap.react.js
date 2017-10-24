import React from 'react';
import classnames from 'classnames';
import Leaflet from 'leaflet';
import { Map, TileLayer, Marker, ZoomControl, PropTypes } from 'react-leaflet';
import MarkerLayer from 'react-leaflet-marker-layer';

import MapCluster from './LeafletMapCluster.react';
import Lasso from './LeafletMapLasso.react';
import DefaultIcon from './LeafletMarkerDefaultIcon';

const ATTRIBUTION = `
  Map data &copy;
  <a href='http://openstreetmap.org'>OpenStreetMap</a> contributors,
  <a href='http://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>,
  Imagery © <a href='http://mapbox.com'>Mapbox</a>
`;

export default createClass({

  displayName: 'LeafletMap',

  propTypes: {
    height: PropTypes.number,
    width: PropTypes.number,
    className: PropTypes.string,
    markerIds: PropTypes.array,
    markers: PropTypes.arrayOf(PropTypes.object),
    markerComponent: PropTypes.func,
    markerSize: PropTypes.number,
    cluster: PropTypes.bool,
    clusterOptions: PropTypes.object,
    center: PropTypes.latlng,
    zoom: PropTypes.number,
    highlightedColour: PropTypes.string,
    lassoPath: PropTypes.array,
    mapboxStyle: PropTypes.string,
    mapboxKey: PropTypes.string,
    buttonClassname: PropTypes.string,
    onBoundsChange: PropTypes.func,
    onLassoPathChange: PropTypes.func,
    refitOnMarkerChange: PropTypes.bool,
  },

  getDefaultProps() {
    return {
      cluster: false,
      markers: [],
      markerIds: [],
      refitOnMarkerChange: true,
    };
  },

  componentDidUpdate(previous) {
    if (this.props.refitOnMarkerChange) {
      if (previous.markerIds !== this.props.markerIds) {
        this.refitMapBounds();
      }
    } else if (previous.markers.length === 0 && this.props.markers) {
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

  onClick(event) {
    if (this.props.onClick) {
      this.props.onClick(event);
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
    for (const marker of markers) {
      if (!marker.position && (!marker.latitude || !marker.longitude)) continue;
      const latitude = marker.latitude || marker.position[0];
      const longitude = marker.longitude || marker.position[1];
      if (latitude > north) north = latitude;
      if (latitude < south) south = latitude;
      if (longitude > east) east = longitude;
      if (longitude < west) west = longitude;
    }
    const southWest = Leaflet.latLng([ south, west ]);
    const northEast = Leaflet.latLng([ north, east ]);
    return Leaflet.latLngBounds(southWest, northEast);
  },

  refitMapBounds(point) {
    if (point) {
      this.leafletMap.leafletElement.panTo(point);
    } else {
      this.leafletMap.leafletElement.fitBounds(this.getBounds(), { maxZoom: 5 });
    }
  },

  renderMarkers() {
    const {
      markers, cluster, markerComponent, highlightedColour,
    } = this.props;

    if (cluster) {
      return (
        <MapCluster
          markers={markers || []}
          onMarkerClick={this.onClusterMarkerClick}
          options={this.props.clusterOptions}
        />
      );
    }

    if (markerComponent) {
      return (
        <MarkerLayer
          markers={markers || []}
          latitudeExtractor={({ position }) => position[0]}
          longitudeExtractor={({ position }) => position[1]}
          markerComponent={markerComponent}
          propsForMarkers={{ onClick: this.onMarkerLayerClick, highlightedColour }}
        />
      );
    }

    if (!markers) return null;

    return markers.map(({ position, title, icon = DefaultIcon }, index) => (
      <Marker
        key={index}
        position={position}
        title={title}
        icon={icon}
      />
    ));
  },

  renderDefaultMarkers() {
    if (!this.props.markers) return null;

    return (
      this.props.markers.map(
        ({ position }, index) =>
          <Marker key={position.join('-')} position={position} />
      )
    );
  },

  render() {
    const { center, zoom, mapboxStyle, mapboxKey } = this.props;
    return (
      <div
        className={
          classnames(
            'cgps-leaflet-map',
            `cgps-leaflet-map--marker-size-${this.props.markerSize}`,
            this.props.className
          )
        }
      >
        <Map
          onClick={this.onClick}
          animate={false}
          center={center}
          zoom={zoom}
          zoomControl={false}
          boundsOptions={{ animate: false }}
          onMoveend={({ target }) => { this.map = target; }}
          ref={(map) => { this.leafletMap = map; }}
          style={{ width: '100%', height: '100%' }}
        >
          <TileLayer
            attribution={ATTRIBUTION}
            url={`https://api.mapbox.com/styles/v1/mapbox/${mapboxStyle}/tiles/{z}/{x}/{y}?access_token=${mapboxKey}`}
          />
          { this.renderMarkers() }
          <Lasso
            className={this.props.buttonClassname}
            initialPath={this.props.lassoPath}
            onPathChange={this.props.onLassoPathChange}
          />
          <ZoomControl
            position="bottomleft"
          />
        </Map>
        {this.props.children}
      </div>
    );
  },

});
