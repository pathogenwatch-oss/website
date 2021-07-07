import React from 'react';
import ReactCSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';

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
