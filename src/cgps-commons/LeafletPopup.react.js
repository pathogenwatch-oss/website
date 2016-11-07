import React from 'react';

import PieChart from '../cgps-commons/PieChart.react.js';

export default React.createClass({

  displayName: 'PieChartMarker',

  render() {
    return (
      <div className="leaflet-popup leaflet-zoom-animated"
        style={{ position: 'absolute', top: '-190px', left: '-90px' }}>
        <a className="leaflet-popup-close-button" href="#close">×</a>
        <div className="leaflet-popup-content-wrapper">
          <div className="leaflet-popup-content" style={{ width: '160px', height: '160px' }}>
            <PieChart slices={this.props.slices} />
          </div>
        </div>
        <div className="leaflet-popup-tip-container">
          <div className="leaflet-popup-tip"></div>
        </div>
      </div>
    );
  },

});
