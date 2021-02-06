import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const ZoomControls = ({ children, className, onZoomIn, onZoomOut }) => (
  <div
    className={classnames('libmr-ZoomControls', className)}
    draggable="false"
  >
    <div className="libmr-ZoomControls-button" title="Zoom in" onClick={onZoomIn}>
      <i className="libmr-ZoomControls-icon material-icons">zoom_in</i>
    </div>
    <div className="libmr-ZoomControls-divider" />
    { children ?
      <>
        {children}
        <div className="libmr-ZoomControls-divider" />
      </> :
      null }
    <div className="libmr-ZoomControls-button" title="Zoom out" onClick={onZoomOut}>
      <i className="libmr-ZoomControls-icon material-icons">zoom_out</i>
    </div>
  </div>
);

ZoomControls.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  onZoomIn: PropTypes.func.isRequired,
  onZoomOut: PropTypes.func.isRequired,
};

export default ZoomControls;
