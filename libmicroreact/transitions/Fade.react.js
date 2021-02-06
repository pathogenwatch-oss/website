import './Fade.css';

import React from 'react';
import PropTypes from 'prop-types';
import CSSMotion from 'rc-animate/es/CSSMotion';
import classnames from 'classnames';

const Fade = (props) => (
  <CSSMotion visible={props.in} removeOnLeave motionName="libmr-Fade">
    { (animation) =>
      React.cloneElement(
        props.children,
        { className: classnames(props.children.props.className, animation.className) }
      ) }
  </CSSMotion>
);

Fade.propTypes = {
  children: PropTypes.element,
  in: PropTypes.bool,
};

export default Fade;
