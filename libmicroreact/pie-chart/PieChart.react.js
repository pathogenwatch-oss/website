import React from 'react';
import PropTypes from 'prop-types';

import drawPie from './draw';
import theme from '../theme';
import defaults from '../defaults';

export default class extends React.Component {
  static displayName = 'PieChart'

  static propTypes = {
    slices: PropTypes.object,
    height: PropTypes.number,
    isHighlighted: PropTypes.bool,
    size: PropTypes.number,
    width: PropTypes.number,
  }

  static defaultProps = {
    height: 32,
    size: defaults.NODE_RADIUS,
    width: 32,
  }

  componentDidMount() {
    this.redraw();
  }

  componentDidUpdate() {
    this.redraw();
  }

  redraw() {
    const ctx = this.canvas.getContext('2d');
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    drawPie(
      ctx,
      this.canvas.width / 2,
      this.canvas.width / 2,
      this.props.size,
      this.props.slices,
      this.props.isHighlighted ? theme.primaryColour : null
    );
  }

  render() {
    return (
      <canvas
        ref={el => { this.canvas = el; }}
        width={this.props.width}
        height={this.props.height}
      />
    );
  }
}
