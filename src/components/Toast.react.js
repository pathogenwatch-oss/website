import '../css/toast.css';

import React from 'react';

import ToastStore from '../stores/ToastStore';

import ToastActionCreators from '../actions/ToastActionCreators';

export default React.createClass({

  displayName: 'Toast',

  getInitialState() {
    const { message, action } = ToastStore.getToast();

    return {
      message,
      action,
      active: typeof message !== 'undefined',
    };
  },

  componentDidMount() {
    ToastStore.addChangeListener(this.handleToastStoreChange);
  },

  componentDidUpdate(_, { message }) {
    // should only focus when a message is added
    if (!this.state.active || message) return;

    if (this.state.action) {
      this.refs.actionButton.focus();
    } else {
      this.refs.closeButton.focus();
    }
  },

  componentWillUnmount() {
    ToastStore.removeChangeListener(this.handleToastStoreChange);
  },

  render() {
    const { active, message, action } = this.state;
    return (
      <div className="wgsa-toast-container">
        <aside className={`wgsa-toast ${active ? 'wgsa-toast--active' : null}`.trim()}>
          <span className="wgsa-toast__message">{message}</span>
          { action &&
            <button ref="actionButton" onClick={this.handleAction} className="wgsa-toast__action mdl-button">
              {action.label}
            </button>
          }
          <button ref="closeButton" onClick={this.handleClose} className="wgsa-toast__dismiss mdl-button mdl-button--icon">
            <i className="material-icons">close</i>
          </button>
        </aside>
      </div>
    );
  },

  handleToastStoreChange() {
    const { message, action } = ToastStore.getToast();
    this.setState({
      message,
      action,
      active: typeof message !== 'undefined',
    });
  },

  handleAction() {
    this.state.action.onClick();
    this.handleClose();
  },

  handleClose() {
    this.setState({ active: false });
    setTimeout(() => ToastActionCreators.hideToast(), 300);
  },

});
