import React from 'react';
import { connect } from 'react-redux';

import { selectGenomes } from '../subselection/actions';

function mapDispatchToProps(dispatch, { genome }) {
  return {
    onClick: () => dispatch(selectGenomes([ genome ])),
  };
}

export default connect(null, mapDispatchToProps)(
  ({ onClick }) => (
    <button
      className="mdl-button mdl-button--icon"
      onClick={onClick}
      title="Add to selection"
    >
      <i className="material-icons">add_circle_outline</i>
    </button>
  )
);
