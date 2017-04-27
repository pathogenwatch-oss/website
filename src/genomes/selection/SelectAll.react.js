import React from 'react';
import { connect } from 'react-redux';

import { selectAll } from './actions';

const SelectAll = ({ onClick }) => (
  <button
    className="mdl-button mdl-button--primary"
    onClick={onClick}
  >
    Select All
  </button>
);

function mapDispatchToProps(dispatch) {
  return {
    onClick: () => dispatch(selectAll()),
  };
}

export default connect(null, mapDispatchToProps)(SelectAll);
