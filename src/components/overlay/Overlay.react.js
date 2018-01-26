import React from 'react';
import classnames from 'classnames';

export default React.createClass({

  propTypes: {
    isVisible: React.PropTypes.bool.isRequired,
    hide: React.PropTypes.func.isRequired,
    children: React.PropTypes.node,
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
        {this.props.children}
      </div>
    );
  },

});
