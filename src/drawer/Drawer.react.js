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
    onHeaderClick: React.PropTypes.func,
    disabled: React.PropTypes.bool,
  },

  getDefaultProps() {
    return {
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

  onHeaderClick() {
    if (this.props.disabled) {
      return;
    }
    if (this.state.expanded) {
      this.setState({ expanded: false });
      return;
    }
    this.props.onHeaderClick();
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
        transitionEnterTimeout={280 * (this.props.isOpen ? 2 : 1)}
        transitionLeaveTimeout={280 * (this.props.isOpen ? 2 : 1)}
      >
        <Overlay isVisible={this.isOverlayVisible()} hide={this.onHeaderClick} />
        { (this.props.visible || this.props.isOpen) ?
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
            <header className="wgsa-drawer__header" onClick={this.onHeaderClick}>
              {this.props.title}
              { !this.props.disabled && this.props.expandable &&
                <button
                  className="mdl-button mdl-button--icon"
                  title={this.state.expanded ? 'Dock' : 'Fullscreen'}
                  onClick={this.toggleExpanded}
                >
                  <i className="material-icons">{this.state.expanded ? 'fullscreen_exit' : 'fullscreen'}</i>
                </button> }
            </header>
            { React.cloneElement(this.props.children, { visible: this.props.isOpen }) }
          </aside>
          : null }
      </ReactCSSTransitionGroup>
    );
  },

});
