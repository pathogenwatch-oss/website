import React from 'react';
import { connect } from 'react-redux';

import { removeOfflineCollection } from './actions';

import { isOffline } from './utils';

const RemoveOfflineCollection = React.createClass({

  getInitialState() {
    return {
      confirming: false,
    };
  },

  warn() {
    this.setState({ confirming: true });
  },

  cancel() {
    this.setState({ confirming: false });
  },

  render() {
    const { onConfirm, disabled } = this.props;

    if (this.state.confirming) {
      return (
        <div className="wgsa-confirm-action">
          <p>This cannot be undone.</p>
          <button className="mdl-button wgsa-button--text" onClick={this.cancel}>
            Cancel
          </button>
          <button className="mdl-button wgsa-button--text mdl-button--primary" onClick={onConfirm}>
            Confirm
          </button>
        </div>
      );
    }

    return (
      <button
        className="mdl-button wgsa-button--text"
        onClick={this.warn}
        disabled={disabled}
        title={disabled ?
          'Remove this collection when you are online again 🙂' :
          'Requires Confirmation'
        }
      >
        Remove
      </button>
    );
  },

});

function mapDispatchToProps(dispatch, { token }) {
  return {
    onConfirm: () => dispatch(removeOfflineCollection(token)),
    disabled: isOffline(),
  };
}

export default connect(null, mapDispatchToProps)(RemoveOfflineCollection);
