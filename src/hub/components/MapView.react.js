import React from 'react';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import { AutoSizer } from 'react-virtualized';

import leaflet from 'leaflet'

const Test = React.createClass({

  contextTypes: {
    map: React.PropTypes.instanceOf(leaflet.Map),
  },

  componentDidMount() {
    window.leaflet = this.context.map;
  },

  render() {
    return <p>test</p>;
  },

});


export default React.createClass({

  propTypes: {
    items: React.PropTypes.array,
  },

  render() {
    const position = [ 51.505, -0.09 ];
    return (
      <div className="wgsa-hub__view">
        <AutoSizer>
          {({ height, width }) => {
            if (window.leaflet) {
              window.leaflet.invalidateSize(true);
            }
            return (
              <Map center={position} zoom={1} style={{ height, width }}>
                <Test />
                <TileLayer
                  url="https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiY2dwc2RldiIsImEiOiJjaW96aXdzdDEwMGV0dm1tMnhqOWIzNXViIn0.2lJftMpp7LBJ_FeumUE4qw"
                  attribution="Map data &copy;<a href='http://openstreetmap.org'>OpenStreetMap</a> contributors, <a href='http://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='http://mapbox.com'>Mapbox</a>"
                />
                <Marker position={position}>
                  <Popup>
                    <span>A pretty CSS3 popup.<br />Easily customizable.</span>
                  </Popup>
                </Marker>
              </Map>
            );
          }}
        </AutoSizer>
      </div>
    );
  },

});
