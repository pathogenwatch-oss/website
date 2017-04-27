import React from 'react';
import { connect } from 'react-redux';

import { toggleSelection } from '../selection/actions';
import { getSelectedGenomes } from '../selection/selectors';

import { statuses } from '../constants';

function mapStateToProps(state, { genome }) {
  const selection = getSelectedGenomes(state);
  const isSelected = (genome.id in selection);
  return {
    isSelected,
    isSelectable: genome.status !== statuses.ERROR,
  };
}

function mapDispatchToProps(dispatch, { genome }) {
  return {
    onClick: () => dispatch(toggleSelection(genome)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(
  ({ isSelectable, isSelected, onClick }) => (
   isSelectable ? (
      <button
        className="mdl-button mdl-button--icon mdl-button--primary"
        onClick={onClick}
        title={isSelected ? 'Remove from Selection' : 'Add to Selection'}
      >
        <i className="material-icons">
          { isSelected ? 'remove_circle' : 'add_circle_outline' }
        </i>
      </button>
    ) : null
  )
);
