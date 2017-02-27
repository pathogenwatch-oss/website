import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

import { moveToBin } from '../thunks';
import { undoMoveToBin } from '../actions';
import { removeGenome } from '../uploads/actions';

import { statuses } from '../uploads/constants';

function mapDispatchToProps(dispatch, { genome }) {
  return {
    actions: {
      removeGenome: () => dispatch(removeGenome(genome.id)),
      moveToBin: () => dispatch(moveToBin(genome)),
      undoMoveToBIn: () => dispatch(undoMoveToBin(genome.id)),
    },
  };
}

export default connect(null, mapDispatchToProps)(
  ({ actions, primary, className, genome = {} }) => {
    if (genome.owner !== 'me' || !genome.uploaded) return null;

    if (genome.status === statuses.ERROR) {
      return (
        <button
          className="mdl-button wgsa-button--text"
          onClick={actions.removeGenome}
        >
          Remove
        </button>
      );
    }

    if (genome.binned) {
      return (
        <button
          className="mdl-button wgsa-button--text"
          onClick={actions.undoMoveToBin}
          title="Restore from Bin"
        >
          Restore
        </button>
      );
    }

    return primary ? (
      <button
        className="mdl-button mdl-button--primary wgsa-button--text"
        onClick={actions.moveToBin}
        title="Move to Bin"
      >
        Move to Bin
      </button>
    ) : (
      <button
        className={classnames('mdl-button mdl-button--icon', className)}
        onClick={actions.moveToBin}
        title="Move to Bin"
      >
        <i className="material-icons">delete</i>
      </button>
    );
  }
);
