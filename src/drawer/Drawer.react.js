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
    };
  },

  onHeaderClick() {
    if (this.props.disabled) {
      return;
    }
    this.props.onHeaderClick();
  },

  isOverlayVisible() {
    return this.props.isOpen;
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
        { (this.props.visible || this.props.isOpen) ?
          <aside
            key={this.props.animationKey || 'wgsa-drawer'}
            className={classnames(
              'wgsa-drawer',
              { 'wgsa-drawer--open': this.props.visible && this.props.isOpen,
                'wgsa-open-drawer': !this.props.visible && this.props.isOpen,
                'wgsa-drawer--disabled': this.props.disabled }
            )}
          >
            <header className="wgsa-drawer__header" onClick={this.onHeaderClick}>
              {this.props.title}
              {this.props.disabled ?
                null :
                <button className="mdl-button mdl-button--icon">
                  <i className="material-icons">{`expand_${this.props.isOpen ? 'more' : 'less'}`}</i>
                </button>}
            </header>
            { React.cloneElement(this.props.children, { visible: this.props.isOpen }) }
          </aside>
          : null }
      </ReactCSSTransitionGroup>
    );
  },

});
