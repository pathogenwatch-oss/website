import React from 'react';
import { connect } from 'react-redux';

import RemoveButton from '../../components/RemoveButton.react';

import { setBinnedFlag } from '../bin/actions';


function mapDispatchToProps(dispatch, { genome }) {
  return {
    moveToBin: () => dispatch(setBinnedFlag([ genome ], true)),
    restoreFromBin: () => dispatch(setBinnedFlag([ genome ], false)),
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
