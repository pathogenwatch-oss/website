import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

import { removeGenome } from '../thunks';

function mapDispatchToProps(dispatch, ownProps) {
  return {
    onClick: () => dispatch(removeGenome(ownProps.genome)),
  };
}

export default connect(null, mapDispatchToProps)(
  ({ onClick, primary, className, genome = {} }) => {
    if (genome.owner !== 'me') return null;

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
