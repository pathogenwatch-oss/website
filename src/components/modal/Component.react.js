import React from 'react';
import classnames from 'classnames';

import Overlay from '../overlay';

export default createClass({

  propTypes: {
    actions: PropTypes.array,
    children: PropTypes.node,
    onClose: PropTypes.func,
    title: PropTypes.node,
  },

  getDefaultProps() {
    return {
      actions: [],
    };
  },

  render() {
    return (
      <div className="wgsa-modal-container">
        <Overlay isVisible hide={this.props.onClose} />
        <aside className={classnames('wgsa-modal', this.props.className)}>
          <header>
            {this.props.title}
            <div className="wgsa-modal-actions" onClick={e => e.stopPropagation()}>
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
          { this.props.children }
        </aside>
      </div>
    );
  },

});
