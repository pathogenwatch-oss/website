import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

import { removeGenome } from '../thunks';

function mapDispatchToProps(dispatch, ownProps) {
  return {
    onClick: () => dispatch(removeGenome(ownProps.name)),
  };
}

export default connect(null, mapDispatchToProps)(
  ({ onClick, primary, className }) => (
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
        className={classnames('mdl-button mdl-button--icon', className)}
        onClick={onClick}
        title="Remove"
      >
        <i className="material-icons">delete</i>
      </button>
    )
  )
);
