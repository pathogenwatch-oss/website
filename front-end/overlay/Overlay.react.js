import React from 'react';
import ReactCSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';

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
