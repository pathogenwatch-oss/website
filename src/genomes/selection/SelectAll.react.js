import React from 'react';
import { connect } from 'react-redux';

import { selectAll } from './actions';
import { getSelectionStatus } from './selectors';

const iconsByStatus = {
  UNCHECKED: 'check_box_outline_blank',
  CHECKED: 'check_box',
  INDETERMINATE: 'indeterminate_check_box',
};

const SelectAll = ({ status, select }) => (
  <button
    className="wgsa-genome-checkbox"
    onClick={select}
    title={status === 'CHECKED' ? 'Remove from Selection' : 'Add to Selection'}
  >
    <i className="material-icons">
      {iconsByStatus[status]}
    </i>
  </button>
);

function mapStateToProps(state) {
  return {
    status: getSelectionStatus(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    select: () => dispatch(selectAll()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectAll);
