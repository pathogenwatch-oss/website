import React from 'react';
import { connect } from 'react-redux';

import { isSelectAllDisabled } from './selectors';

import { selectAll } from '../selection/actions';

import { getSelectionLimit } from './utils';

function getTitle(disabled) {
  if (disabled) {
    return `Selection is limited to ${getSelectionLimit()} genomes. Please refine your search.`;
  }
  return null;
}

const SelectAll = ({ disabled, onClick }) => (
  <button
    className="mdl-button mdl-button--primary"
    onClick={onClick}
    disabled={disabled}
    title={getTitle(disabled)}
  >
    Select All
  </button>
);

function mapStateToProps(state) {
  return {
    disabled: isSelectAllDisabled(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onClick: () => dispatch(selectAll()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectAll);
