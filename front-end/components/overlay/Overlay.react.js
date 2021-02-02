import React from 'react';
import classnames from 'classnames';

import Fade from '../fade';

export default React.createClass({
  propTypes: {
    visible: React.PropTypes.bool.isRequired,
    hide: React.PropTypes.func,
    children: React.PropTypes.node,
  },

  componentDidMount() {
    window.addEventListener('keydown', this.closeMenuOnEsc);
  },

  componentWillUnmount() {
    window.removeEventListener('keydown', this.closeMenuOnEsc);
  },

  closeMenuOnEsc(event) {
    if (this.props.visible && event.keyCode === 27) {
      this.props.hide();
    }
  },

  render() {
    const { visible, children, hide, className, ...props } = this.props;
    return (
      <Fade out>
        {visible && (
          <div
            onClick={hide}
            className={classnames(className, 'wgsa-overlay', {
              'wgsa-overlay--no-content': !children,
            })}
            {...props}
          >
            {children}
          </div>
        )}
      </Fade>
    );
  },
});
