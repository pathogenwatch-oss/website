import React from 'react';
import PropTypes from 'prop-types';

import ZoomControls from '../zoom-controls';

const iconsByMainAxis = {
  x: [
    'fullscreen',
    'swap_horiz',
    'swap_vert',
  ],
  y: [
    'fullscreen',
    'swap_vert',
    'swap_horiz',
  ],
};

export default class extends React.Component {
  static displayName = 'TreeZoomControls'

  static propTypes = {
    className: PropTypes.string,
    mainAxis: PropTypes.string,
    onZoomIn: PropTypes.func.isRequired,
    onZoomOut: PropTypes.func.isRequired,
    onHorizZoomIn: PropTypes.func.isRequired,
    onHorizZoomOut: PropTypes.func.isRequired,
    onVertZoomIn: PropTypes.func.isRequired,
    onVertZoomOut: PropTypes.func.isRequired,
  }

  state = {
    mode: 0,
  }

  toggleMode = () => {
    this.setState({
      mode: this.state.mode === 2 ? 0 : this.state.mode + 1,
    });
  }

  render() {
    const zoomIn = [
      this.props.onZoomIn,
      this.props.onHorizZoomIn,
      this.props.onVertZoomIn,
    ];
    const zoomOut = [
      this.props.onZoomOut,
      this.props.onHorizZoomOut,
      this.props.onVertZoomOut,
    ];
    const { mainAxis = 'x' } = this.props;
    return (
      <ZoomControls
        className={this.props.className}
        onZoomIn={zoomIn[this.state.mode]}
        onZoomOut={zoomOut[this.state.mode]}
      >
        <div className="libmr-ZoomControls-button" title="Toogle zoom mode" onClick={this.toggleMode}>
          <i className="libmr-ZoomControls-icon material-icons">
            { iconsByMainAxis[mainAxis][this.state.mode] }
          </i>
        </div>
      </ZoomControls>
    );
  }
}
