import React from 'react';
import { connect } from 'react-redux';

import RemoveButton from '../../components/RemoveButton.react';

import { moveToBin } from './actions';
import { removeGenomes } from '../uploads/actions';

import { statuses } from '../uploads/constants';

function mapDispatchToProps(dispatch, { genome }) {
  return {
    removeGenome: () => dispatch(removeGenomes([ genome.id ])),
    moveToBin: () => dispatch(moveToBin(genome, true)),
    restoreFromBin: () => dispatch(moveToBin(genome, false)),
  };
}

export default connect(null, mapDispatchToProps)(
  ({ genome = {}, removeGenome, ...props }) => {
    if (genome.owner !== 'me') return null;

    if (genome.status === statuses.ERROR) {
      return (
        <button
          className="mdl-button wgsa-button--text"
          onClick={removeGenome}
        >
          Remove
        </button>
      );
    }

    return (
      <RemoveButton item={genome} {...props} />
    );
  }
);
