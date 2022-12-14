import React from 'react';

const { PropTypes } = React;
const size = 100;
const radCircumference = Math.PI * 2;
const center = size / 2;
const radius = center - 1; // padding to prevent clipping

/**
 * @param {Object[]} slices
 * @return {Object[]}
 */
function renderPaths({ slices, onSliceClick }) {
  const total = slices.reduce((totalValue, { value }) => totalValue + value, 0);
  let radSegment = 0;
  let lastX = radius;
  let lastY = 0;

  return slices.map((slice, index) => {
    const { colour, value } = slice;
    // Should we just draw a circle?
    if (value === total) {
      return (
        <circle
          r={radius}
          cx={center}
          cy={center}
          fill={colour}
          key={index}
          data-count={value}
          onClick={e => onSliceClick && onSliceClick(slice, e)}
        />
      );
    }

    if (value === 0) {
      return null;
    }

    const valuePercentage = value / total;

    // Should the arc go the long way round?
    const longArc = (valuePercentage <= 0.5) ? 0 : 1;

    radSegment += valuePercentage * radCircumference;
    const nextX = Math.cos(radSegment) * radius;
    const nextY = Math.sin(radSegment) * radius;

    // d is a string that describes the path of the slice.
    // The weirdly placed minus signs [eg, (-(lastY))] are due to the fact
    // that our calculations are for a graph with positive Y values going up,
    // but on the screen positive Y values go down.
    const d = [
      `M ${center},${center}`,
      `l ${lastX},${-lastY}`,
      `a${radius},${radius}`,
      '0',
      `${longArc},0`,
      `${nextX - lastX},${-(nextY - lastY)}`,
      'z',
    ].join(' ');

    lastX = nextX;
    lastY = nextY;

    return (
      <path
        d={d}
        fill={colour}
        key={index}
        data-count={value}
        onClick={(e) => {
          if (onSliceClick) onSliceClick(slice, e);
        }}
      />
    );
  });
}

/**
 * Generates an SVG pie chart.
 * @see {http://wiki.scribus.net/canvas/Making_a_Pie_Chart}
 */
export default class PieChart extends React.Component {

  /**
   * @return {Object}
   */
  render() {
    const {
      borderWidth = 7.5,
      borderColour = '#555',
      donutFill = '#fff',
    } = this.props;
    return (
      <svg viewBox={`0 0 ${size} ${size}`} className={this.props.className}>
        <g transform={`rotate(-90 ${center} ${center})`}>
          {renderPaths(this.props)}
        </g>
        { borderWidth > 0 &&
          <circle
            cx={center}
            cy={center}
            r={center - borderWidth / 2}
            fill="none"
            strokeWidth={borderWidth}
            stroke={borderColour}
          />
        }
        { this.props.donut &&
            <circle
              cx={center}
              cy={center}
              r={(center - borderWidth) / 2}
              fill={donutFill}
              strokeWidth={borderWidth}
              stroke={borderColour}
            /> }
        }
        <text x="50" y="50"></text>
      </svg>
    );
  }
}

PieChart.propTypes = {
  className: React.PropTypes.string,
  borderWidth: React.PropTypes.number,
  borderColour: React.PropTypes.string,
  donut: React.PropTypes.bool,
  slices: React.PropTypes.arrayOf(React.PropTypes.shape({
    colour: React.PropTypes.string.isRequired, // hex colour
    value: React.PropTypes.number.isRequired,
  })).isRequired,
  onSliceClick: React.PropTypes.func,
};
