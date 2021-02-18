import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import RelativePortal from 'react-relative-portal';
import CSSMotion from 'rc-animate/es/CSSMotion';

const origin = {
  down: 'top',
  up: 'bottom',
};

function getStyle({ top = 0, height = 0 }, align, direction) {
  return {
    maxHeight:
      direction === 'up' ?
        `${top - 40}px` :
        `calc(100vh - ${(top + height) + 40}px)`,
    transformOrigin: `${origin[direction]} ${align}`,
  };
}

class Menu extends React.Component {
  static propTypes = {
    active: PropTypes.bool,
    align: PropTypes.oneOf([ 'left', 'right' ]),
    button: PropTypes.node,
    caret: PropTypes.bool,
    children: PropTypes.node,
    className: PropTypes.string,
    direction: PropTypes.oneOf([ 'up', 'down' ]),
    header: PropTypes.node,
    open: PropTypes.bool,
    style: PropTypes.object,
    toggle: PropTypes.func,
    toggleOnClick: PropTypes.bool,
  }

  constructor(props) {
    super(props);
    this.buttonRef = React.createRef();
  }

  handleOutClick = e => {
    const { current } = this.buttonRef;
    if (current && current.contains(e.target)) return;
    this.props.toggle();
  };

  handleKeyUp = e => {
    if (e.keyCode === 27) this.props.toggle();
  }

  render() {
    const {
      align = 'left',
      button,
      caret = false,
      children,
      className,
      direction = 'down',
      header,
      open = false,
      style,
      toggle,
      toggleOnClick = true,
    } = this.props;

    const bounds = this.el ? this.el.getBoundingClientRect() : {};
    const { height = 0 } = bounds;

    return (
      <div
        className={classnames('libmr-Menu', { open, caret }, className)}
        onKeyUp={open ? (e) => this.handleKeyUp(e) : null}
        ref={el => { this.el = el; }}
        style={style}
        tabIndex="-1"
      >
        { React.cloneElement(button, { ref: this.buttonRef, onClick: toggle, open }) }
        <RelativePortal
          className="libmr-RelativePortal"
          component="div"
          right={align === 'right' ? 0 : undefined}
          bottom={direction === 'up' ? height : undefined}
          onOutClick={open ? (e) => this.handleOutClick(e) : null}
        >
          <CSSMotion visible={open} removeOnLeave motionName="libmr">
            { (animation) =>
              (<div
                className={classnames('libmr-Menu-element', align, direction, { caret }, className, animation.className)}
                style={getStyle(bounds, align, direction)}
                tabIndex="-1"
              >
                { header }
                <div className="libmr-Menu-content" onClick={toggleOnClick ? toggle : null}>
                  { children }
                </div>
              </div>) }
          </CSSMotion>
        </RelativePortal>
      </div>
    );
  }
}

export default Menu;
