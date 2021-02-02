import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

export default ({ children, visible }) => (
  <ReactCSSTransitionGroup
    transitionName="wgsa-overlay"
    transitionEnterTimeout={280}
    transitionLeaveTimeout={280}
  >
  { visible &&
    <div className="wgsa-content-overlay">
      {children}
    </div> }
  </ReactCSSTransitionGroup>
);
