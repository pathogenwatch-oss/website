import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import classnames from 'classnames';

import Overlay from '../components/overlay';

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

  isOverlayVisible() {
    if (this.props.isOpen) {
      return this.props.visible;
    }
    return this.state.open;
  },

  render() {
    return (
      <ReactCSSTransitionGroup
        className="wgsa-drawer-container"
        transitionName={`wgsa${this.props.isOpen ? '-open-' : '-'}drawer`}
        transitionEnterTimeout={280 * (this.props.isOpen ? 2 : 1)}
        transitionLeaveTimeout={280 * (this.props.isOpen ? 2 : 1)}
      >
        <Overlay isVisible={this.isOverlayVisible()} hide={this.onHeaderClick} />
        { this.props.visible ?
          <aside
            key={this.props.animationKey || 'wgsa-drawer'}
            className={classnames(
              'wgsa-drawer',
              { 'wgsa-drawer--open': !this.props.isOpen && this.state.open },
              { 'wgsa-open-drawer': this.props.isOpen }
            )}
          >
            <header className="wgsa-drawer__header" onClick={this.onHeaderClick}>
              {this.props.title}
              <button className="mdl-button mdl-button--icon">
                <i className="material-icons">{`expand_${this.state.open ? 'more' : 'less'}`}</i>
              </button>
            </header>
            {React.cloneElement(this.props.children, { open: this.state.open })}
          </aside>
          : null }
      </ReactCSSTransitionGroup>
    );
  },

});
