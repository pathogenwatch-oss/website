import React from 'react';
import { connect } from 'react-redux';

import { toggleAddMetadata } from './actions';

const Toggle = ({ toggle }) => (
  <button
    className="mdl-button mdl-button--fab mdl-button--mini-fab mdl-button--alt mdl-shadow--3dp"
    onClick={toggle}
    title="Add Metadata"
  >
    <i className="material-icons">note_add</i>
  </button>
);

function mapDispatchToProps(dispatch) {
  return {
    toggle: () => dispatch(toggleAddMetadata()),
  };
}

export default connect(null, mapDispatchToProps)(Toggle);
