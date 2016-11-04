import React from 'react';
import ReactDOMServer from 'react-dom/server';
import Leaflet from 'leaflet';
import { Map, TileLayer, Marker, PropTypes } from 'react-leaflet';

import PieChart from '../cgps-commons/PieChart.react';

import MapCluster from './LeafletMapCluster.react';
import MapLasso from './LeafletMapLasso.react';

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
    cluster: React.PropTypes.bool,
    center: PropTypes.latlng,
    zoom: React.PropTypes.number,
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

  componentWillUnmount() {
    const { onBoundsChange } = this.props;
    if (onBoundsChange && this.map) {
      const center = this.map.getCenter();
      const zoom = this.map.getZoom();
      onBoundsChange({ center, zoom });
    }
  },

  onMarkerClick({ target }) {
    if (this.props.onMarkerClick) {
      const { id } = target.options;
      this.props.onMarkerClick(id);
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

  renderMarkers() {
    const { markers, cluster } = this.props;
    if (cluster) {
      return (
        <MapCluster
          markers={this.props.markers}
          onMarkerClick={this.onMarkerClick}
        />
      );
    }
    return markers.map(({ position, colours, title }, index) => (
      <Marker
        key={index}
        position={position}
        title={title}
        icon={Leaflet.divIcon({
          className: 'leaflet-marker-icon',
          html: ReactDOMServer.renderToString(<PieChart slices={Array.from(colours.entries()).map(([ color, value ]) => ({ color, value }))} />),
          iconSize: [ 20, 20 ],
          iconAnchor: [ 10, 10 ],
          popupAnchor: [ 0, -20 ],
        })}
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
      >
        <TileLayer
          attribution={ATTRIBUTION}
          url={`https://api.mapbox.com/styles/v1/mapbox/${mapboxStyle}/tiles/{z}/{x}/{y}?access_token=${mapboxKey}`}
        />
        { this.renderMarkers() }
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
