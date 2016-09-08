import React from 'react';
import { connect } from 'react-redux';

import { isSupportedSpeciesSelected } from '../selectors';

import { createCollection } from '../thunks';

function mapStateToProps(state) {
  return {
    disabled: !isSupportedSpeciesSelected(state),
  };
}

export default connect(mapStateToProps)(({ disabled, dispatch }) => (
  <button
    className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored"
    disabled={disabled}
    onClick={() => dispatch(createCollection())}
  >
    Create Collection
  </button>
));
