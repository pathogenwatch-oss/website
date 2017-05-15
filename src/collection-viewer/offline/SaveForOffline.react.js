import React from 'react';

import Spinner from '../../components/Spinner.react';

import { statuses } from './constants';

import { isSupported } from '../../offline/utils';

export default React.createClass({

  propTypes: {
    status: React.PropTypes.number,
    checkStatus: React.PropTypes.func,
    onSave: React.PropTypes.func,
  },

  componentDidMount() {
    if (isSupported()) {
      this.props.checkStatus();
    }
  },

  renderStatusContent() {
    switch (this.props.status) {
      case statuses.SAVED:
        return (
          <p>
            <i className="material-icons">check_circle</i> Saved for offline use.
          </p>
        );
      case statuses.ERRORED:
        return <p>Something went wrong. 😞</p>;
      default:
        return <p>(Page will refresh once saved)</p>;
    }
  },

  render() {
    const { status } = this.props;

    if (isSupported()) {
      return (
        <div className="wgsa-save-for-offline">
          { status !== statuses.SAVED &&
            <button
              className="mdl-button mdl-button--colored mdl-button--raised"
              onClick={this.props.onSave}
              disabled={status === statuses.SAVING}
            >
              Save for Offline Use
            </button> }
          { status === statuses.SAVING && <Spinner /> }
          {this.renderStatusContent()}
        </div>
      );
    }

    return null;
  },

});
