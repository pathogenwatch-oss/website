import '../css/circular-progress.css';

import React from 'react';
import PropTypes from 'prop-types';

export default class MultiProgress extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const radius = this.props.radius - this.props.strokeWidth / 2;
    const width = this.props.radius * 2;
    const height = this.props.radius * 2;
    const viewBox = `0 0 ${width} ${height}`;
    const dashArray = radius * Math.PI * 2;

    const segments = [];
    let percentAcc = 0;
    for (const segment of this.props.segments || []) {
      segments.unshift({
        colour: segment.colour,
        name: segment.name,
        dashOffset: dashArray - (dashArray * segment.percentage) / 100,
        rotate: (360 / 100) * percentAcc - 90,
      });
      percentAcc += segment.percentage;
    }

    const { progress } = this.props;

    return (
      <svg
        className={`CircularProgress ${
          this.props.progress >= 100 ? 'CircularProgress-success' : ''
        }`.trim()}
        width={this.props.radius * 2}
        height={this.props.radius * 2}
        viewBox={viewBox}
        style={this.props.style}
      >
        <circle
          className="CircularProgress-Bg"
          cx={this.props.radius}
          cy={this.props.radius}
          r={radius}
          strokeWidth={`${this.props.strokeWidth}px`}
        />
        {segments.map(s => (
          <circle
            key={s.name}
            className="CircularProgress-Fg"
            cx={this.props.radius}
            cy={this.props.radius}
            r={radius}
            strokeWidth={`${this.props.strokeWidth}px`}
            stroke={s.colour}
            style={{
              strokeDasharray: dashArray,
              strokeDashoffset: s.dashOffset,
              transform: `rotate(${s.rotate}deg)`,
            }}
          />
        ))}
        {!isNaN(progress) && (
          <text
            className="CircularProgress-Text"
            x={this.props.radius}
            y={this.props.radius}
            dy=".4em"
            textAnchor="middle"
          >
            {`${progress.toFixed(this.props.decimalPlaces)}%`}
          </text>
        )}
      </svg>
    );
  }
}

MultiProgress.propTypes = {
  decimalPlaces: PropTypes.number,
  progress: PropTypes.number,
  radius: PropTypes.number,
  segments: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      percentage: PropTypes.number,
      colour: PropTypes.string,
    })
  ),
  strokeWidth: PropTypes.number.isRequired,
  // style: PropTypes.style,
};

MultiProgress.defaultProps = {
  decimalPlaces: 0,
  radius: 50,
  strokeWidth: 1,
};
