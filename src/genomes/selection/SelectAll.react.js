import React from 'react';
import { connect } from 'react-redux';

import { isSelectAllDisabled, isSelectionLimitReached } from './selectors';
import { selectAll } from './actions';
import { getSelectionLimit } from './utils';

function getTitle(isLimitReached, isDisabled) {
  const limit = getSelectionLimit();

  if (isLimitReached) {
    return `Selection limit of ${limit} genomes reached.`;
  }

  if (isDisabled) {
    return `Selection is limited to ${limit} genomes. Please refine your search.`;
  }

  return null;
}

const SelectAll = ({ isDisabled, isLimitReached, onClick }) => (
  <button
    className="mdl-button mdl-button--primary"
    onClick={onClick}
    disabled={isDisabled}
    title={getTitle(isLimitReached, isDisabled)}
  >
    Select All
  </button>
);

function mapStateToProps(state) {
  return {
    isLimitReached: isSelectionLimitReached(state),
    isDisabled: isSelectAllDisabled(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onClick: () => dispatch(selectAll()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectAll);
