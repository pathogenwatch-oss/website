import React from 'react';
import { connect } from 'react-redux';

import RemoveButton from '../../components/RemoveButton.react';

import { setBinnedStatus } from './actions';


function mapDispatchToProps(dispatch, { genome }) {
  return {
    moveToBin: () => dispatch(setBinnedStatus(genome, true)),
    restoreFromBin: () => dispatch(setBinnedStatus(genome, false)),
  };
}

export default connect(null, mapDispatchToProps)(
  ({ genome = {}, ...props }) => {
    if (genome.owner !== 'me') return null;
    return (
      <RemoveButton item={genome} {...props} />
    );
  }
);
