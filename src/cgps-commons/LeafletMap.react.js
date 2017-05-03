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

export default React.createClass({

  displayName: 'LeafletMap',

  propTypes: {
    height: React.PropTypes.number,
    width: React.PropTypes.number,
    className: React.PropTypes.string,
    markers: React.PropTypes.arrayOf(React.PropTypes.object),
    markerComponent: React.PropTypes.func,
    markerSize: React.PropTypes.number,
    cluster: React.PropTypes.bool,
    clusterOptions: React.PropTypes.object,
    center: PropTypes.latlng,
    zoom: React.PropTypes.number,
    highlightedColour: React.PropTypes.string,
    lassoPath: React.PropTypes.array,
    mapboxStyle: React.PropTypes.string,
    mapboxKey: React.PropTypes.string,
    buttonClassname: React.PropTypes.string,
    onBoundsChange: React.PropTypes.func,
    onLassoPathChange: React.PropTypes.func,
  },

  getDefaultProps() {
    return {
      cluster: false,
      markers: [],
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

  onClick(event) {
    if (this.props.onClick &&
      event.target.classList.contains('leaflet-container')) {
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
    for (const { position } of markers) {
      if (position[0] > north) north = position[0];
      if (position[0] < south) south = position[0];
      if (position[1] > east) east = position[1];
      if (position[1] < west) west = position[1];
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
          options={this.props.clusterOptions}
        />
      );
    }

    if (markerComponent) {
      return (
        <MarkerLayer
          markers={markers}
          latitudeExtractor={({ position }) => position[0]}
          longitudeExtractor={({ position }) => position[1]}
          markerComponent={markerComponent}
          propsForMarkers={{ onClick: this.onMarkerLayerClick, highlightedColour }}
        />
      );
    }

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
        onClick={this.onClick}
      >
        <Map
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
          {/* { this.renderDefaultMarkers() } */}
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
