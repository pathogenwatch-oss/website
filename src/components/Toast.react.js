import React from 'react';

export default React.createClass({

  displayName: 'Toast',

  handleClose() {
    this.props.handleClose();
  },

  render() {
    var toastIcon = {};

    switch (this.props.type) {
      case 'warn':
        toastIcon.type = 'warning';
        break;
      case 'error':
        toastIcon.type = 'error_outline';
        break;
      case 'success':
        toastIcon.type = 'done';
        break;
      default:
        toastIcon.type = 'info';
    }

    return (
      <div className={`wgsa-toast-container ${this.props.sticky ? "wgsa-toast-sticky" : "wgsa-toast-nonsticky"}`}>
        <div className="wgsa-toast-icon">
          <i style={toastIcon.style} className="material-icons">{toastIcon.type}</i>
        </div>
        <div className="wgsa-toast-message">
          {this.props.message && this.props.message}
        </div>
        <a onClick={this.handleClose} className="wgsa-toast-close">
          <i className="material-icons">close</i>
        </a>
      </div>
    );
  },

});
