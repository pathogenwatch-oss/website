import React from 'react';
import Leaflet from 'leaflet';
import { Map, Marker, Popup, TileLayer, PropTypes } from 'react-leaflet';

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
    center: PropTypes.latlng,
    zoom: React.PropTypes.number,
    lassoPath: React.PropTypes.array,
    mapboxStyle: React.PropTypes.string,
    mapboxKey: React.PropTypes.string,
    lassoButtonClassname: React.PropTypes.string,
    onBoundsChange: React.PropTypes.func,
    onLassoPathChange: React.PropTypes.func,
  },

  componentWillUnmount() {
    const { onBoundsChange } = this.props;
    if (onBoundsChange && this.map) {
      const center = this.map.getCenter();
      const zoom = this.map.getZoom();
      onBoundsChange({ center, zoom });
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
        <MapCluster>
          { this.props.markers.map(({ position, label }, index) =>
            <Marker
              key={index}
              position={position}
              icon={
                Leaflet.divIcon({
                  className: 'material-icons',
                  html: 'place',
                  iconSize: [ 40, 40 ],
                  iconAnchor: [ 20, 37 ],
                  popupAnchor: [ 0, -32 ],
                })
              }
            >
              { label ? <Popup><span>{ label }</span></Popup> : null }
            </Marker>
          )}
        </MapCluster>
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
