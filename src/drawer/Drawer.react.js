import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import classnames from 'classnames';

export default React.createClass({

  propTypes: {
    title: React.PropTypes.node,
    children: React.PropTypes.node,
    visible: React.PropTypes.bool,
    isOpen: React.PropTypes.bool,
    onClose: React.PropTypes.func,
  },

  getDefaultProps() {
    return {
      visible: false,
      isOpen: false,
    };
  },

  getInitialState() {
    return {
      open: this.props.isOpen,
    };
  },

  onHeaderClick() {
    if (this.props.isOpen) {
      this.props.onClose();
      return;
    }

    this.setState({
      open: !this.state.open,
    });
  },

  render() {
    return (
      <ReactCSSTransitionGroup
        className="wgsa-drawer-container"
        transitionName="wgsa-drawer"
        transitionEnterTimeout={280}
        transitionLeaveTimeout={280}
      >
      { this.props.visible ?
        <aside key="wgsa-drawer" className={classnames('wgsa-drawer', { 'wgsa-drawer--open': this.state.open })}>
          <header className="wgsa-drawer__header" onClick={this.onHeaderClick}>
            {this.props.title}
            <button className="mdl-button mdl-button--icon">
              <i className="material-icons">{`expand_${this.state.open ? 'more' : 'less'}`}</i>
            </button>
          </header>
          {this.props.children}
        </aside>
        : null
      }
      </ReactCSSTransitionGroup>
    );
  },

});
