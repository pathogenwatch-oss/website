import React from 'react';
import { connect } from 'react-redux';

import { showGenomeDetails } from '../../genome-drawer';

function mapDispatchToProps(dispatch, ownProps) {
  return {
    onClick: () => dispatch(showGenomeDetails(ownProps.name)),
  };
}

export default connect(null, mapDispatchToProps)(
  ({ onClick }) => (
    <button
      className="mdl-button mdl-button--primary wgsa-button--text"
      onClick={onClick}
    >
      View Details
    </button>
  )
);
