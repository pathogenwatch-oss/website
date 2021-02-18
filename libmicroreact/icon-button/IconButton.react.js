import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

const IconButton = React.forwardRef(({ children, className, onClick, title }, ref) => (
  <button
    className={classnames('mdc-icon-button', className)}
    onClick={onClick}
    ref={ref}
    title={title}
  >
    {children}
  </button>
));

IconButton.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  onClick: PropTypes.func,
  title: PropTypes.string,
};

export default IconButton;
