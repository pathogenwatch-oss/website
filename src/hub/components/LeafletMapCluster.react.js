/* global L */

import React from 'react';
import Leaflet from 'leaflet';
import 'leaflet.markercluster';

export default React.createClass({

  displayName: 'LeafletMapCluster',

  propTypes: {
    children: React.PropTypes.oneOfType([
      React.PropTypes.arrayOf(React.PropTypes.node),
      React.PropTypes.node,
    ]),
  },

  contextTypes: {
    map: React.PropTypes.instanceOf(Leaflet.Map),
  },

  childContextTypes: {
    map: React.PropTypes.oneOfType([
      React.PropTypes.instanceOf(L.markerClusterGroup),
      React.PropTypes.instanceOf(Leaflet.Map),
    ]),
    layerContainer: React.PropTypes.shape({
      addLayer: React.PropTypes.func.isRequired,
      removeLayer: React.PropTypes.func.isRequired,
    }),
  },

  getChildContext() {
    return {
      map: this.context.map,
      layerContainer: this.markers,
    };
  },

  componentDidMount() {
    this.markers = L.markerClusterGroup();
    this.context.map.addLayer(this.markers);
  },

  render() {
    const map = this.context.map;
    if (map) {
      return (<div>
        {
          React.Children.map(
            this.props.children,
            child => React.cloneElement(child, { map, layerContainer: map })
          )
        }
      </div>);
    }
    return null;
  },

});
