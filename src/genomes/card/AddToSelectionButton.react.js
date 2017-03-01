import React from 'react';
import { connect } from 'react-redux';

import { toggleSelectedGenomes } from '../selection/actions';
import { getSelectedGenomes } from '../selection/selectors';

function mapStateToProps(state, { genome }) {
  return {
    isSelected: (genome.id in getSelectedGenomes(state)),
  };
}

function mapDispatchToProps(dispatch, { genome }) {
  return {
    onClick: () => dispatch(toggleSelectedGenomes([ genome ])),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(
  ({ isSelected, onClick }) => (
    <button
      className="mdl-button mdl-button--icon mdl-js-ripple-effect mdl-button--primary"
      onClick={onClick}
      title={ isSelected ? 'Remove from selection' : 'Add to selection' }
    >
      <i className="material-icons">
        { isSelected ? 'remove_circle' : 'add_circle_outline' }
      </i>
    </button>
  )
);
