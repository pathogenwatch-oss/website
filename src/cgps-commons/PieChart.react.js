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
function renderPaths(slices, border = 0) {
  const total = slices.reduce((totalValue, { value }) => totalValue + value, 0);

  let radSegment = 0;
  let lastX = radius - border;
  let lastY = 0;

  return slices.map(({ colour, value }, index) => {
    // Should we just draw a circle?
    if (value === total) {
      return (
        <circle
          r={radius - border}
          cx={center}
          cy={center}
          fill={colour}
          key={index}
          data-count={value}
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
    const nextX = Math.cos(radSegment) * (radius - border);
    const nextY = Math.sin(radSegment) * (radius - border);

    // d is a string that describes the path of the slice.
    // The weirdly placed minus signs [eg, (-(lastY))] are due to the fact
    // that our calculations are for a graph with positive Y values going up,
    // but on the screen positive Y values go down.
    const d = [
      `M ${center},${center}`,
      `l ${lastX},${-lastY}`,
      `a${radius - border},${radius - border}`,
      '0',
      `${longArc},0`,
      `${nextX - lastX},${-(nextY - lastY)}`,
      'z',
    ].join(' ');

    lastX = nextX;
    lastY = nextY;

    return <path d={d} fill={colour} key={index} data-count={value} />;
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
    const { borderWidth = 7.5, borderColour = '#555' } = this.props;
    return (
      <svg viewBox={`0 0 ${size} ${size}`} className={this.props.className}>
        <g transform={`rotate(-90 ${center} ${center})`}>
          {renderPaths(this.props.slices)}
        </g>
        { borderWidth > 0 ? <circle cx={center} cy={center} r={center - borderWidth / 2} fill="none" strokeWidth={borderWidth} stroke={borderColour} /> : null }
        { this.props.donut ? <circle cx={center} cy={center} r={center / 2} /> : null }
        <text x="50" y="50"></text>
      </svg>
    );
  }
}

PieChart.propTypes = {
  className: PropTypes.string,
  borderWidth: PropTypes.number,
  borderColour: PropTypes.string,
  donut: PropTypes.bool,
  slices: PropTypes.arrayOf(PropTypes.shape({
    colour: PropTypes.string.isRequired, // hex colour
    value: PropTypes.number.isRequired,
  })).isRequired,
};
