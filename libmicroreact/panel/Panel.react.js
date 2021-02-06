import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import Fade from '../transitions/Fade.react';
import ControlsButton from '../controls-button';
import ZoomControls from '../zoom-controls';

const Panel = (props) => (
  <div
    className={classnames('libmr-Panel', props.className)}
    style={props.style}
  >
    {props.children}
    <ControlsButton
      className="libmr-Panel-controls-toggler"
      active={props.controlsVisible}
      title={props.controlsVisible ? 'Hide controls' : 'Show controls'}
      onClick={() => props.onControlsVisibleChange(!props.controlsVisible)}
    >
      <i className="material-icons">tune</i>
    </ControlsButton>
    <Fade in={props.controlsVisible}>
      <div className="libmr-Panel-primary-controls">
        {props.primaryControls}
      </div>
    </Fade>
    <Fade in={props.controlsVisible}>
      <div className="libmr-Panel-secondary-controls">
        {props.secondaryControls}
      </div>
    </Fade>
    {
      props.zoomControls === true &&
        <Fade in={props.controlsVisible}>
          {
            <ZoomControls
              onZoomIn={() => props.onZoomChange(+1)}
              onZoomOut={() => props.onZoomChange(-1)}
            />
          }
        </Fade>
    }
    {
      React.isValidElement(props.zoomControls) &&
        <Fade in={props.controlsVisible}>
          {props.zoomControls}
        </Fade>
    }
  </div>
);

Panel.propTypes = {
  className: PropTypes.string,
  controlsVisible: PropTypes.bool,
  style: PropTypes.object,
  children: PropTypes.node,
  primaryControls: PropTypes.node,
  secondaryControls: PropTypes.node,
  zoomControls: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.node,
  ]),
  onZoomChange: PropTypes.func,
  onControlsVisibleChange: PropTypes.func,
};

Panel.defaultProps = {
  zoomControls: true,
};

export default Panel;
