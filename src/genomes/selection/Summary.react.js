import React from 'react';
import { connect } from 'react-redux';

import { getSelectionSize } from './selectors';

import { toggleDrawer } from './actions';

const Summary = ({ size, onClick }) => (
  <div className="wgsa-selection-summary">
    <button className="mdl-chip mdl-chip--alt" onClick={onClick}>
      {/* <span className="mdl-chip__contact">{size}</span> */}
      <span className="mdl-chip__text">Create Collection ({size} Genomes)</span>
    </button>
  </div>
);

function mapStateToProps(state) {
  return {
    size: getSelectionSize(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onClick: () => dispatch(toggleDrawer()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Summary);
