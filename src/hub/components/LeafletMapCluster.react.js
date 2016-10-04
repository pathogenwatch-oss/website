/* global L */

import React from 'react';
import Leaflet from 'leaflet';
import { MapLayer } from 'react-leaflet';
import 'leaflet.markercluster';

const icon = Leaflet.divIcon({
  className: 'material-icons',
  html: 'place',
  iconSize: [ 40, 40 ],
  iconAnchor: [ 20, 37 ],
  popupAnchor: [ 0, -32 ],
});

class MarkerCluster extends MapLayer {

  componentWillMount() {
    super.componentWillMount();
    this.leafletElement = Leaflet.markerClusterGroup();
  }

  componentDidMount() {
    super.componentDidMount();
    this.addMarkers(this.props.markers);
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.markers !== this.props.markers;
  }

  componentDidUpdate() {
    this.addMarkers(this.props.markers);
  }

  addMarkers(markers) {
    if (!Array.isArray(markers) || markers.length === 0) {
      return;
    }

    const layers = markers.map(({ position, label }) =>
      Leaflet.marker(position, { icon }).bindPopup(label)
    );

    this.leafletElement.eachLayer(this.removeMarker.bind(this));

    this.leafletElement.addLayers(layers);
  }

  removeMarker(marker) {
    if (marker.options.icon === icon) {
      this.leafletElement.removeLayer(marker);
    }
  }

  render() {
    return null;
  }
}

MarkerCluster.propTypes = {
  map: React.PropTypes.object,
  markers: React.PropTypes.array,
};

MarkerCluster.defaultProps = {
  markers: [],
};

export default MarkerCluster;

//
// export default React.createClass({
//
//   displayName: 'LeafletMapCluster',
//
//   propTypes: {
//     children: React.PropTypes.oneOfType([
//       React.PropTypes.arrayOf(React.PropTypes.node),
//       React.PropTypes.node,
//     ]),
//   },
//
//   contextTypes: {
//     map: React.PropTypes.instanceOf(Leaflet.Map),
//   },
//
//   childContextTypes: {
//     map: React.PropTypes.oneOfType([
//       React.PropTypes.instanceOf(L.markerClusterGroup),
//       React.PropTypes.instanceOf(Leaflet.Map),
//     ]),
//     layerContainer: React.PropTypes.shape({
//       addLayer: React.PropTypes.func.isRequired,
//       removeLayer: React.PropTypes.func.isRequired,
//     }),
//   },
//
//   getChildContext() {
//     return {
//       map: this.context.map,
//       layerContainer: this.markers,
//     };
//   },
//
//   componentDidMount() {
//     this.leafletElement = L.markerClusterGroup();
//     // this.context.map.addLayer(this.markers);
//   },
//
//   render() {
//     const map = this.context.map;
//     if (map) {
//       return (<div>
//         {
//           React.Children.map(
//             this.props.children,
//             child => React.cloneElement(child, { map, layerContainer: map })
//           )
//         }
//       </div>);
//     }
//     return null;
//   },
//
// });
