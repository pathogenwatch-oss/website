import '../css/toast.css';

import React from 'react';

import ToastStore from '../stores/ToastStore';

import ToastActionCreators from '../actions/ToastActionCreators';

export default React.createClass({

  displayName: 'Toast',

  getInitialState() {
    return {
      message: null,
    };
  },

  componentDidMount() {
    ToastStore.addChangeListener(this.handleToastStoreChange);
  },

  componentWillUnmount() {
    ToastStore.removeChangeListener(this.handleToastStoreChange);
  },

  render() {
    const { message, sticky, action } = this.state;
    return (
      <div className="wgsa-toast-container">
      { message &&
        <aside className={`wgsa-toast wgsa-toast--${sticky ? 'sticky' : 'nonsticky'}`}>
          <span className="wgsa-toast__message">
            {message}
          </span>
          { action &&
            <button onClick={this.handleAction} className="wgsa-toast__action mdl-button">
              {action.label}
            </button>
          }
          <button onClick={this.handleClose} className="wgsa-toast__dismiss mdl-button mdl-button--icon">
            <i className="material-icons">close</i>
          </button>
        </aside>
      }
      </div>
    );
  },

  handleToastStoreChange() {
    const { message, sticky, action } = ToastStore.getToast();
    this.setState({
      message,
      sticky,
      action,
    });
  },

  handleAction() {
    this.state.action.onClick();
    this.handleClose();
  },

  handleClose() {
    ToastActionCreators.hideToast();
  },

});
