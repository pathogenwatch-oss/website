import React from 'react';
import classnames from 'classnames';
import Leaflet from 'leaflet';
import { Map, TileLayer, Marker, ZoomControl, PropTypes as LeafletPropTypes } from 'react-leaflet';

import MarkerLayer from './LeafletMarkerLayer.react';
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
    markerIds: React.PropTypes.array,
    markers: React.PropTypes.arrayOf(React.PropTypes.object),
    markerComponent: React.PropTypes.func,
    markerSize: React.PropTypes.number,
    cluster: React.PropTypes.bool,
    clusterOptions: React.PropTypes.object,
    center: LeafletPropTypes.latlng,
    zoom: React.PropTypes.number,
    highlightedColour: React.PropTypes.string,
    lassoPath: React.PropTypes.array,
    mapboxStyle: React.PropTypes.string,
    mapboxKey: React.PropTypes.string,
    buttonClassname: React.PropTypes.string,
    onBoundsChange: React.PropTypes.func,
    onLassoPathChange: React.PropTypes.func,
    refitOnMarkerChange: React.PropTypes.bool,
  },

  getDefaultProps() {
    return {
      cluster: false,
      markers: [],
      markerIds: [],
      refitOnMarkerChange: true,
    };
  },

  componentDidMount() {
    this.refitMapBounds();
  },

  componentDidUpdate(previous) {
    if (previous.markers.length === 0 && this.props.markers.length) {
      this.refitMapBounds();
    } else if (this.props.refitOnMarkerChange) {
      if (previous.markerIds !== this.props.markerIds) {
        this.refitMapBounds();
      }
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
      this.props.onClick(event, this.map);
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
      this.leafletMap.leafletElement.fitBounds(this.getBounds());
    }
  },

  renderMarkers() {
    const {
      markers, cluster, markerComponent, highlightedColour, markerProps = {},
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
          propsForMarkers={{
            ...markerProps,
            onClick: this.onMarkerLayerClick,
            highlightedColour,
          }}
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
          <div className="cgps-leaflet-map-controls">
            {this.props.controls}
            <Lasso
              className={this.props.buttonClassname}
              initialPath={this.props.lassoPath}
              onPathChange={this.props.onLassoPathChange}
            />
          </div>
          <ZoomControl
            position="bottomright"
          />
        </Map>
        {this.props.children}
      </div>
    );
  },

});
