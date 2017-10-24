import React from 'react';
import classnames from 'classnames';

export default createClass({

  propTypes: {
    isVisible: PropTypes.bool.isRequired,
    hide: PropTypes.func.isRequired,
    children: PropTypes.node,
  },

  componentDidMount() {
    window.addEventListener('keydown', this.closeMenuOnEsc);
  },

  componentWillUnmount() {
    window.removeEventListener('keydown', this.closeMenuOnEsc);
  },

  closeMenuOnEsc(event) {
    if (this.props.isVisible && event.keyCode === 27) {
      this.props.hide();
    }
  },

  render() {
    return (
      <div
        onClick={this.props.hide}
        className={classnames(
          'wgsa-overlay',
          { 'wgsa-overlay--is-visible': this.props.isVisible },
          { 'wgsa-overlay--no-content': !this.props.children }
        )}
      >
        <div className="mdl-shadow--4dp" onClick={e => e.stopPropagation()}>
          {this.props.children}
        </div>
      </div>
    );
  },

});
