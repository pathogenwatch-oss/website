import React from 'react';

import MarkerHighlight from '../cgps-commons/MarkerHighlight.react.js';
import PieChart from '../cgps-commons/PieChart.react.js';

export default React.createClass({

  displayName: 'LeafletPieChartMarker',

  shouldComponentUpdate(next) {
    const { marker } = this.props;
    if (marker.highlighted !== next.marker.highlighted) return true;
    if (marker.slices.size !== next.marker.slices.size) return true;
    const slices = marker.slices.entries();
    const nextSlices = next.marker.slices.entries();
    for (let i = 0; i < marker.slices.size; i++) {
      const [ colour, value ] = slices.next().value;
      const [ nextColour, nextValue ] = nextSlices.next().value;
      if (colour !== nextColour || value !== nextValue) {
        return true;
      }
    }
    return false;
  },

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
        <PieChart
          slices={slices}
          borderColour={this.props.borderColour}
          borderWidth={this.props.botderWidth}
        />
      </div>
    );
  },

});
