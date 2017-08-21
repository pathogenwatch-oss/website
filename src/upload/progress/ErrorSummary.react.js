import React from 'react';
import { connect } from 'react-redux';

import { Summary } from '../../filter/summary';
import { getTotalErrors, isRetryable } from './selectors';

import { retryAll, removeAll } from './actions';

const ErrorSummary = React.createClass({

  render() {
    const { totalErrors, retryable, onRetry, onRemove } = this.props;
    return (
      <Summary className="wgsa-hub-summary">
        <span className="wgsa-error-message">{totalErrors} file{totalErrors === 1 ? '' : 's'} could not be uploaded.</span>
        {retryable && <button className="mdl-button mdl-button--primary" onClick={onRetry}>Retry {totalErrors === 1 ? 'It' : 'Them'}</button>}
        <button className="mdl-button" onClick={onRemove}>Remove {totalErrors === 1 ? 'It' : 'Them'}</button>
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
