import React from 'react';

import Spinner from '../../components/Spinner.react';

import { statuses } from './constants';

export default React.createClass({

  propTypes: {
    status: React.PropTypes.number,
    checkStatus: React.PropTypes.func,
    onSave: React.PropTypes.func,
  },

  componentDidMount() {
    this.props.checkStatus();
  },

  render() {
    const { status } = this.props;
    return (
      <div className="wgsa-save-for-offline">
        { status === statuses.SAVED ?
            <p>
              <i className="material-icons">check_circle</i> Saved for offline use.
            </p> :
            <button
              className="mdl-button mdl-button--colored mdl-button--raised"
              onClick={this.props.onSave}
              disabled={status === statuses.SAVING}
            >
              Save for Offline
            </button> }
        { status === statuses.SAVING && <Spinner /> }
      </div>
    );
  },

});
