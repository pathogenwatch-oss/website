import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const MenuButton = React.forwardRef(
  ({ active, children, className, clear, direction = 'down', label = children, onClick, open, title }, ref) => (
    <span /* this is a span to allow the cancel button to be clickable */
      ref={ref}
      role="button"
      className={classnames('libmr-MenuButton', { active, open }, className)}
      onClick={onClick}
      title={title}
    >
      { typeof label === 'string' ? <span>{label}</span> : label }
      { active && clear ?
        <button className="libmr-MenuButton-clear" onClick={clear}>
          <i className="material-icons" onClick={clear}>cancel</i>
        </button> :
        <i className="material-icons">arrow_drop_{direction}</i> }
    </span>
  )
);

MenuButton.propTypes = {
  active: PropTypes.bool,
  children: PropTypes.node,
  className: PropTypes.string,
  clear: PropTypes.func,
  direction: PropTypes.oneOf([ 'down', 'up' ]),
  label: PropTypes.node,
  onClick: PropTypes.func,
  open: PropTypes.bool,
  title: PropTypes.string,
};

export default MenuButton;
