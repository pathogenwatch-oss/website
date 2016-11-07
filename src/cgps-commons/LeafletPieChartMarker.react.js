import React from 'react';

import MarkerHighlight from '../cgps-commons/MarkerHighlight.react.js';
import PieChart from '../cgps-commons/PieChart.react.js';

export default React.createClass({

  displayName: 'LeafletPieChartMarker',

  render() {
    const { marker, style, onClick, highlightedColour } = this.props;
    const slices = Array.from(marker.slices.entries())
        .map(([ colour, value ]) => ({ colour, value }));
    return (
      <div
        style={style}
        className="leaflet-marker-icon"
        onClick={event => {
          event.stopPropagation();
          event.nativeEvent.stopImmediatePropagation();
          onClick({ event, marker });
        }}
      >
        { marker.highlighted && <MarkerHighlight colour={highlightedColour} /> }
        <PieChart slices={slices} borderWidth={2} />
      </div>
    );
  },

});
