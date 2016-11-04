import React from 'react';

import PieChart from '../cgps-commons/PieChart.react.js';

export default React.createClass({

  displayName: 'LeafletPieChartMarker',

  render() {
    const { marker, style, onClick } = this.props;
    const slices = Array.from(marker.slices.entries())
        .map(([ colour, value ]) => ({ colour, value }));
    return (
      <div style={style} className="leaflet-marker-icon" onClick={onClick}>
        <PieChart slices={slices} />
      </div>
    );
  },

});
