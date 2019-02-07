import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

export default ({ className, children, out = false }) => (
  <ReactCSSTransitionGroup
    className={className}
    transitionName="wgsa-fade"
    transitionLeave={out}
    transitionEnterTimeout={280}
    transitionLeaveTimeout={280}
  >
    {children}
  </ReactCSSTransitionGroup>
);
