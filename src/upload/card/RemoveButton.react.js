import React from 'react';
import { connect } from 'react-redux';

import { removeGenomes } from '../actions';

function mapDispatchToProps(dispatch, { genome }) {
  return {
    removeGenome: () => dispatch(removeGenomes([ genome.id ])),
  };
}

export default connect(null, mapDispatchToProps)(
  ({ removeGenome }) => (
    <button
      className="mdl-button wgsa-button--text"
      onClick={removeGenome}
    >
      Remove
    </button>
  )
);
