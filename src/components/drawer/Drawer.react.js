import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import classnames from 'classnames';

import Overlay from '../components/overlay';

export default createClass({

  propTypes: {
    title: PropTypes.node,
    children: PropTypes.node,
    visible: PropTypes.bool,
    isOpen: PropTypes.bool,
    onClose: PropTypes.func,
    disabled: PropTypes.bool,
  },

  getDefaultProps() {
    return {
      actions: [],
      visible: false,
      isOpen: false,
      disabled: false,
      expandable: false,
    };
  },

  getInitialState() {
    return {
      expanded: false,
    };
  },

  onClose() {
    if (this.props.disabled) {
      return;
    }
    if (this.state.expanded) {
      this.setState({ expanded: false });
      return;
    }
    this.props.onClose();
  },

  toggleExpanded(e) {
    e.stopPropagation();
    this.setState({ expanded: !this.state.expanded });
  },

  isOverlayVisible() {
    return this.props.isOpen;
  },

  render() {
    return (
      <ReactCSSTransitionGroup
        className={classnames(
          'wgsa-drawer-container',
          { 'wgsa-drawer-container--expanded': this.props.isOpen && this.state.expanded }
        )}
        transitionName={`wgsa${this.props.isOpen ? '-open-' : '-'}drawer`}
        transitionEnterTimeout={280}
        transitionLeaveTimeout={280}
      >
        <Overlay isVisible={this.isOverlayVisible()} hide={this.onClose} />
        { (this.props.isOpen) ?
          <aside
            key={this.props.animationKey || 'wgsa-drawer'}
            className={classnames(
              'wgsa-drawer',
              this.props.className,
              { 'wgsa-drawer--open': this.props.visible && this.props.isOpen,
                'wgsa-open-drawer': !this.props.visible && this.props.isOpen,
                'wgsa-drawer--disabled': this.props.disabled }
            )}
          >
            <header className="wgsa-drawer__header">
              {this.props.title}
              <div className="wgsa-drawer-actions" onClick={e => e.stopPropagation()}>
                {this.props.actions}
                { !this.props.disabled && this.props.expandable &&
                  <button
                    className="mdl-button mdl-button--icon"
                    title={this.state.expanded ? 'Dock' : 'Fullscreen'}
                    onClick={this.toggleExpanded}
                  >
                    <i className="material-icons">{this.state.expanded ? 'fullscreen_exit' : 'fullscreen'}</i>
                  </button> }
                <button
                  className="mdl-button mdl-button--icon"
                  title="Close Drawer"
                  onClick={this.onClose}
                >
                  <i className="material-icons">close</i>
                </button>
              </div>
            </header>
            { this.props.children }
          </aside>
          : null }
      </ReactCSSTransitionGroup>
    );
  },

});
