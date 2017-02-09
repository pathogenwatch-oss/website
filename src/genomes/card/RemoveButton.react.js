import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

import { removeGenome } from '../thunks';
import actions from '../actions';

function mapDispatchToProps(dispatch, { genome }) {
  return {
    onClick: () => dispatch(
      genome.binned ? actions.undoRemoveGenome(genome.id) : removeGenome(genome)
    ),
  };
}

export default connect(null, mapDispatchToProps)(
  ({ onClick, primary, className, genome = {} }) => {
    if (genome.owner !== 'me') return null;

    if (genome.binned) {
      return (
        <button
          className="mdl-button wgsa-button--text"
          onClick={onClick}
          title="Restore from Bin"
        >
          Restore
        </button>
      );
    }

    return primary ? (
      <button
        className="mdl-button mdl-button--primary wgsa-button--text"
        onClick={onClick}
        title="Move to Bin"
      >
        Move to Bin
      </button>
    ) : (
      <button
        className={classnames('mdl-button mdl-button--icon', className)}
        onClick={onClick}
        title="Move to Bin"
      >
        <i className="material-icons">delete</i>
      </button>
    );
  }
);
