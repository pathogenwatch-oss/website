import '../css/toast.css';

import React from 'react';
import ToastStore from '../stores/ToastStore';

export default React.createClass({

  displayName: 'Toast',

  getInitialState() {
    return {
      data: null,
      active: null,
    };
  },

  componentDidMount() {
    ToastStore.addChangeListener(this.handleToastStoreChange);
  },

  componentWillUnmount() {
    ToastStore.removeChangeListener(this.handleToastStoreChange);
  },

  render() {
    const { data, active } = this.state;
    return (
      <div className="wgsa-toast-container">
      { active &&
        <aside className={`wgsa-toast wgsa-toast--${data.sticky ? 'sticky' : 'nonsticky'}`}>
          <span className="wgsa-toast__message">
            {data.message && data.message}
          </span>
          { data.action &&
            <button onClick={this.action.onClick} className="wgsa-toast__action">
              {this.action.label}
            </button>
          }
        </aside>
      }
      </div>
    );
  },

  handleToastStoreChange() {
    const toast = ToastStore.getToast();
    this.setState({
      data: toast,
      active: toast ? true : false,
    });
  },

  handleClose() {
    this.setState({
      active: false,
    });
  },

});
