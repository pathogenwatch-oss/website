import React from 'react';
import { connect } from 'react-redux';

import { toggleSelectedGenomes } from '../selection/actions';
import { getSelectedGenomes } from '../selection/selectors';

import { statuses } from '../constants';

function mapStateToProps(state, { genome }) {
  return {
    isSelectable: genome.status !== statuses.ERROR,
    isSelected: (genome.id in getSelectedGenomes(state)),
  };
}

function mapDispatchToProps(dispatch, { genome }) {
  return {
    onClick: () => dispatch(toggleSelectedGenomes([ genome ])),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(
  ({ isSelectable, isSelected, onClick }) => (
   isSelectable ? (
      <button
        className="mdl-button mdl-button--icon mdl-js-ripple-effect mdl-button--primary"
        onClick={onClick}
        title={ isSelected ? 'Remove from Selection' : 'Add to Selection' }
      >
        <i className="material-icons">
          { isSelected ? 'remove_circle' : 'add_circle_outline' }
        </i>
      </button>
    ) : null
  )
);
