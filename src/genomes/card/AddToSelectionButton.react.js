import React from 'react';
import { connect } from 'react-redux';

import { toggleSelection } from '../selection/actions';
import { getSelectedGenomes, getSelectedGenomeIds } from '../selection/selectors';
import { isOverSelectionLimit, getSelectionLimit } from '../selection/utils';

import { statuses } from '../constants';

function mapStateToProps(state, { genome }) {
  const selection = getSelectedGenomes(state);
  const isSelected = (genome.id in selection);
  return {
    isSelected,
    isSelectable: genome.status !== statuses.ERROR,
    isDisabled: !isSelected &&
      isOverSelectionLimit(getSelectedGenomeIds(state).length + 1),
  };
}

function mapDispatchToProps(dispatch, { genome }) {
  return {
    onClick: () => dispatch(toggleSelection(genome)),
  };
}

function getTitle(isSelected, isDisabled) {
  if (isDisabled) {
    return `Selection limit of ${getSelectionLimit()} genomes reached.`;
  }
  return isSelected ? 'Remove from Selection' : 'Add to Selection';
}

export default connect(mapStateToProps, mapDispatchToProps)(
  ({ isSelectable, isSelected, isDisabled, onClick }) => (
   isSelectable ? (
      <button
        className="mdl-button mdl-button--icon mdl-button--primary"
        onClick={onClick}
        disabled={isDisabled}
        title={getTitle(isSelected, isDisabled)}
      >
        <i className="material-icons">
          { isSelected ? 'remove_circle' : 'add_circle_outline' }
        </i>
      </button>
    ) : null
  )
);
