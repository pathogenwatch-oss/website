import React from 'react';
import { connect } from 'react-redux';

import { toggleSelection } from './actions';
import { getSelectedGenomes } from './selectors';

const AddToSelection = ({ isSelected, onClick }) => (
  <button
    className="wgsa-genome-checkbox"
    onClick={onClick}
    title={isSelected ? 'Remove from Selection' : 'Add to Selection'}
  >
    <i className="material-icons">
      { isSelected ? 'check_box' : 'check_box_outline_blank' }
    </i>
  </button>
);

function mapStateToProps(state, { genome }) {
  const selection = getSelectedGenomes(state);
  return {
    isSelected: (genome.id in selection),
  };
}

function mapDispatchToProps(dispatch, { genome }) {
  return {
    onClick: e => e.stopPropagation() || dispatch(toggleSelection(genome)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AddToSelection);
