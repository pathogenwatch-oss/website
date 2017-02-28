import React from 'react';
import { connect } from 'react-redux';

import { Summary } from '../../filter/viewing';
import { getTotalErrors } from './selectors';

import { retryAll, removeAll } from './actions';

const ErrorSummary = React.createClass({

  render() {
    const { totalErrors, onRetry, onRemove } = this.props;
    return (
      <Summary className="wgsa-hub-summary">
        <span className="wgsa-error-message">{totalErrors} files could not be uploaded.</span>
        <button className="mdl-button mdl-button--primary" onCLick={onRetry}>Retry all</button>
        <button className="mdl-button" onCLick={onRemove}>Remove all</button>
      </Summary>
    );
  },

});

function mapStateToProps(state) {
  return {
    totalErrors: getTotalErrors(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onRetry: () => dispatch(retryAll()),
    onRemove: () => dispatch(removeAll()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ErrorSummary);
