import React from 'react';
import { connect } from 'react-redux';

import { getFilter } from '../selectors';

import { resetFilter } from './actions';

const ResetButton = ({ onClick, visible }) => (
  visible ?
    <button
      className="mdl-button mdl-button--icon"
      onClick={onClick}
      title="Reset Selection"
    >
      <i className="material-icons">clear</i>
    </button>
  : null
);

function mapStateToProps(state) {
  return {
    visible: getFilter(state).active,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onClick: () => dispatch(resetFilter()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ResetButton);
