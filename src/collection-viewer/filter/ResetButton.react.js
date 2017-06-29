import React from 'react';
import { connect } from 'react-redux';

import { getFilter } from '../selectors';

import { resetFilter } from './actions';

const ResetButton = ({ onClick, disabled }) => (
  <button
    className="mdl-button mdl-button--icon"
    onClick={onClick}
    disabled={disabled}
    title="Reset Selection"
  >
    <i className="material-icons">clear</i>
  </button>
);

function mapStateToProps(state) {
  return {
    disabled: !getFilter(state).active,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onClick: () => dispatch(resetFilter()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ResetButton);
