import React from 'react';
import { connect } from 'react-redux';

import { getSelectedGenomeList } from './selectors';
import { setSelection } from './actions';

const ClearSelection = ({ hasSelection, onClick }) => (
    hasSelection ?
    <button className="mdl-button" onClick={onClick}>
      Clear Selection
    </button> :
    null
);

function mapStateToProps(state) {
  return {
    hasSelection: getSelectedGenomeList(state).length > 0,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onClick: () => dispatch(setSelection([])),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ClearSelection);
