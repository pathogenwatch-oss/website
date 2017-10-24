import React from 'react';
import { connect } from 'react-redux';

import { selectAll, unselectAll } from './actions';
import { areAllSelected } from './selectors';

const SelectAll = ({ allSelected, select, unselect }) => (
  <button
    className="wgsa-genome-checkbox"
    onClick={allSelected ? unselect : select}
    title={allSelected ? 'Remove from Selection' : 'Add to Selection'}
  >
    <i className="material-icons">
      { allSelected ? 'check_box' : 'check_box_outline_blank' }
    </i>
  </button>
);

function mapStateToProps(state) {
  return {
    allSelected: areAllSelected(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    select: () => dispatch(selectAll()),
    unselect: () => dispatch(unselectAll()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectAll);
