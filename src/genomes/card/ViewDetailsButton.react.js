import React from 'react';
import { connect } from 'react-redux';

import { showGenomeDrawer } from '../../genome-drawer';

function mapDispatchToProps(dispatch, ownProps) {
  return {
    onClick: () => dispatch(showGenomeDrawer(ownProps.genome)),
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
