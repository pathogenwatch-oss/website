import React from 'react';
import { connect } from 'react-redux';

import { Summary } from '../../filter/viewing';
import { getTotalErrors, isRetryable } from './selectors';

import { retryAll, removeAll } from './actions';

const ErrorSummary = React.createClass({

  render() {
    const { totalErrors, retryable, onRetry, onRemove } = this.props;
    return (
      <Summary className="wgsa-hub-summary">
        <span className="wgsa-error-message">{totalErrors} files could not be uploaded.</span>
        {retryable && <button className="mdl-button mdl-button--primary" onClick={onRetry}>Retry All</button>}
        <button className="mdl-button" onClick={onRemove}>Remove All</button>
      </Summary>
    );
  },

});

function mapStateToProps(state) {
  return {
    totalErrors: getTotalErrors(state),
    retryable: isRetryable(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onRetry: () => dispatch(retryAll()),
    onRemove: () => dispatch(removeAll()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ErrorSummary);
