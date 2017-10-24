import React from 'react';
import classnames from 'classnames';

import MarkerHighlight from '../cgps-commons/MarkerHighlight.react.js';
import PieChart from '../cgps-commons/PieChart.react.js';

const className = 'leaflet-marker-icon';

export function isMarker(element) {
  return (
    element.ownerSVGElement &&
    element.ownerSVGElement.parentNode &&
    element.ownerSVGElement.parentNode.classList.contains(className)
  );
}

export default createClass({

  displayName: 'LeafletPieChartMarker',

  shouldComponentUpdate(next) {
    const { marker } = this.props;
    if (marker.id.length !== next.marker.id.length) return true;
    for (const id of marker.id) {
      if (next.marker.id.indexOf(id) === -1) return true;
    }
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
        className={classnames(
          className,
          { highlighted: marker.highlighted }
        )}
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
