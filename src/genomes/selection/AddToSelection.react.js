import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

import { toggleSelection } from './actions';
import { getSelectedGenomes } from './selectors';

const AddToSelection = ({ isSelected, onClick, className }) => (
  <button
    className={classnames('wgsa-genome-checkbox', className)}
    onClick={onClick}
    title={isSelected ? 'Remove from Selection' : 'Add to Selection'}
  >
    <i className="material-icons">
      { isSelected ? 'check_box' : 'check_box_outline_blank' }
    </i>
  </button>
);

function mapStateToProps(state, { genomes }) {
  const selection = getSelectedGenomes(state);
  return {
    isSelected: genomes.every(genome => (genome.id in selection)),
  };
}

function mapDispatchToProps(dispatch, { genomes, index, onClick }) {
  return {
    onClick: onClick ||
      (e => e.stopPropagation() || dispatch(toggleSelection(genomes, index))),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AddToSelection);
