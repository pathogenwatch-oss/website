import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

const Button = React.forwardRef(({ children, className, onClick, raised }, ref) => (
  <button
    ref={ref}
    className={classnames(
      'mdc-button',
      { 'mdc-button--raised': raised },
      className
    )}
    onClick={onClick}
  >
    <span className="mdc-button__label">{children}</span>
  </button>
));

Button.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  onClick: PropTypes.func,
  raised: PropTypes.bool,
};

export default Button;
