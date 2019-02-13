import React from 'react';
import classnames from 'classnames';

import Overlay from '../overlay';

export default React.createClass({
  propTypes: {
    actions: React.PropTypes.array,
    children: React.PropTypes.node,
    onClose: React.PropTypes.func,
    title: React.PropTypes.node,
  },

  getDefaultProps() {
    return {
      actions: [],
    };
  },

  render() {
    return (
      <div
        className={classnames(
          'wgsa-modal-container',
          this.props.containerClassName
        )}
      >
        <Overlay isVisible hide={this.props.onClose}>
          <aside className={classnames('wgsa-modal', this.props.className)}>
            <header onClick={e => e.stopPropagation()}>
              {this.props.title}
              <div className="wgsa-modal-actions">
                {this.props.actions}
                <button
                  className="mdl-button mdl-button--icon"
                  title="Close"
                  onClick={this.props.onClose}
                >
                  <i className="material-icons">close</i>
                </button>
              </div>
            </header>
            {React.cloneElement(this.props.children, {
              onClick: e => e.stopPropagation(),
            })}
          </aside>
        </Overlay>
      </div>
    );
  },
});
