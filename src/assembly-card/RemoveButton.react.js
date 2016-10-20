import React from 'react';
import { connect } from 'react-redux';

import { removeFasta } from '../hub/thunks';

function mapDispatchToProps(dispatch, ownProps) {
  return {
    onClick: () => dispatch(removeFasta(ownProps.name)),
  };
}

export default connect(null, mapDispatchToProps)(
  ({ onClick, primary }) => (
    primary ? (
      <button
        className="mdl-button mdl-button--primary wgsa-button--text"
        onClick={onClick}
        title="Remove"
      >
        Remove
      </button>
    ) : (
      <button
        className="wgsa-remove-fasta-button mdl-button mdl-button--icon"
        onClick={onClick}
        title="Remove"
      >
        <i className="material-icons">delete</i>
      </button>
    )
  )
);
