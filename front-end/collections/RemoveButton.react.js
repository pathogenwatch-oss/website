import React from 'react';
import { connect } from 'react-redux';

import RemoveButton from '../components/RemoveButton.react';

import { setBinnedStatus } from './thunks';

function mapDispatchToProps(dispatch, { collection }) {
  return {
    moveToBin: () => dispatch(setBinnedStatus(collection, true)),
    restoreFromBin: () => dispatch(setBinnedStatus(collection, false)),
  };
}

export default connect(null, mapDispatchToProps)(
  ({ collection = {}, ...props }) =>
    <RemoveButton item={collection} {...props} />
);
