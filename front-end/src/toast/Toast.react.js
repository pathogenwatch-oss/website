import './styles.css';

import React from 'react';
import { connect } from 'react-redux';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import { hideToast } from './index';

const ToastContainer = React.createClass({

  displayName: 'ToastContainer',

  componentDidUpdate(previously) {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    // should only focus when a new toast becomes visible
    if (previously.visible && !this.props.visible) return;

    if (this.props.action && this.refs.actionButton) {
      this.refs.actionButton.focus();
    } else if (this.refs.closeButton) {
      this.refs.closeButton.focus();
    }

    const { autohide = true, onCloseButtonClick } = this.props;
    if (autohide) {
      this.timeout = setTimeout(onCloseButtonClick, 5000);
    }
  },

  render() {
    const { visible, message, action, onCloseButtonClick, closeButton = true } = this.props;
    return (
      <ReactCSSTransitionGroup
        className="wgsa-toast-container"
        transitionName="wgsa-toast"
        transitionEnterTimeout={280}
        transitionLeaveTimeout={280}
      >
        { visible &&
        <aside className="wgsa-toast" key={message}>
          <span className="wgsa-toast__message">{message}</span>
          { action &&
            <button
              ref="actionButton"
              onClick={() => { action.onClick(); onCloseButtonClick(); }}
              className="wgsa-toast__action mdl-button"
            >
              {action.label}
            </button> }
          { closeButton &&
            <button
              ref="closeButton"
              onClick={onCloseButtonClick}
              className="wgsa-toast__dismiss mdl-button mdl-button--icon"
            >
              <i className="material-icons">close</i>
            </button> }
        </aside> }
      </ReactCSSTransitionGroup>
    );
  },

});

function mapStateToProps({ toast }) {
  return toast;
}

function mapDispatchToProps(dispatch) {
  return {
    onCloseButtonClick: () => dispatch(hideToast()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ToastContainer);
