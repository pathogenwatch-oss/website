import './styles.css';

import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import { hideToast } from './index';

const ToastContainer = React.createClass({

  displayName: 'ToastContainer',

  componentDidUpdate(previously) {
    // should only focus when a message is added
    if (previously.visible) return;

    if (this.props.action) {
      this.refs.actionButton.focus();
    } else {
      this.refs.closeButton.focus();
    }
  },

  render() {
    const { visible, message, action, onCloseButtonClick } = this.props;
    return (
      <ReactCSSTransitionGroup
        className="wgsa-toast-container"
        element="div"
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
              onClick={() => action.onClick() && onCloseButtonClick()}
              className="wgsa-toast__action mdl-button"
            >
              {action.label}
            </button>
          }
          <button
            ref="closeButton"
            onClick={onCloseButtonClick}
            className="wgsa-toast__dismiss mdl-button mdl-button--icon"
          >
            <i className="material-icons">close</i>
          </button>
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
