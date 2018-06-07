import React from 'react';
import { connect } from 'react-redux';

import { selectAll } from './actions';
import { isUnfilteredList } from '../summary/selectors';
import { getSelectionStatus } from './selectors';

const iconsByStatus = {
  UNCHECKED: 'check_box_outline_blank',
  CHECKED: 'check_box',
  INDETERMINATE: 'indeterminate_check_box',
};

function getTitle(status, disabled) {
  if (disabled) return '"Select All" is not available on the unfiltered list, please select at least one filter criterion.';
  return status === 'CHECKED' ? 'Remove from Selection' : 'Add to Selection';
}

const SelectAll = ({ status, disabled, select }) => (
  <button
    className="wgsa-genome-checkbox"
    onClick={select}
    disabled={disabled}
    title={getTitle(status, disabled)}
  >
    <i className="material-icons">
      {iconsByStatus[status]}
    </i>
  </button>
);

function mapStateToProps(state) {
  return {
    status: getSelectionStatus(state),
    disabled: isUnfilteredList(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    select: () => dispatch(selectAll()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectAll);
