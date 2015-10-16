import React from 'react';
import ToastStore from '../stores/ToastStore';

export default React.createClass({

  displayName: 'Toast',

  getInitialState() {
    return {
      data: ToastStore.getToastData(),
      active: ToastStore.toastActive(),
    };
  },

  componentDidMount() {
    ToastStore.addChangeListener(this.handleToastStoreChange);
  },

  componentWillUnmount() {
    ToastStore.removeChangeListener(this.handleToastStoreChange);
  },

  handleToastStoreChange() {
    this.setState({
      data: ToastStore.getToastData(),
      active: ToastStore.toastActive()
    });
  },

  handleClose() {
    this.setState({
      active: false
    });
  },

  render() {
    var data = this.state.data.data;
    var toastIcon = {
      style: {
        color: '#fff'
      }
    };

    if (data) {
      switch (data.type) {
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
    }

    return (
      <div>
      { this.state.active &&
        <div className={`wgsa-toast-container ${data.sticky ? "wgsa-toast-sticky" : "wgsa-toast-nonsticky"}`}>
          <div className="wgsa-toast-icon">
            <i style={toastIcon.style} className="material-icons">{toastIcon.type}</i>
          </div>
          <div className="wgsa-toast-message">
            {data.message && data.message}
          </div>
          { data.sticky &&
            <a onClick={this.handleClose} className="wgsa-toast-close">
              <i className="material-icons">close</i>
            </a>
          }
        </div>
      }
      </div>
    );
  },

});
