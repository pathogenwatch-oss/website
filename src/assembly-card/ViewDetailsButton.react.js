import React from 'react';
import { connect } from 'react-redux';

import { showAssemblyDetails } from '../assembly-detail-view';

function mapDispatchToProps(dispatch, ownProps) {
  return {
    onClick: () => dispatch(showAssemblyDetails(ownProps.name)),
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
