import '../css/circular-progress.css';

import React from 'react';

export default class CircularProgress extends React.Component {
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

    const { progress = 0 } = this.props;

    return (
      <svg
        className={`CircularProgress ${
          this.props.percentage >= 100 ? 'CircularProgress-success' : ''
        }`.trim()}
        width={this.props.radius * 2}
        height={this.props.radius * 2}
        viewBox={viewBox}
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
        <text
          className="CircularProgress-Text"
          x={this.props.radius}
          y={this.props.radius}
          dy=".4em"
          textAnchor="middle"
        >
          {`${progress.toFixed(this.props.decimalPlaces)}%`}
        </text>
      </svg>
    );
  }
}

CircularProgress.propTypes = {
  decimalPlaces: React.PropTypes.number,
  percentage: React.PropTypes.number,
  radius: React.PropTypes.number,
  strokeWidth: React.PropTypes.number,
};

CircularProgress.defaultProps = {
  decimalPlaces: 0,
  percentage: 50,
  radius: 50,
  strokeWidth: 1,
};
