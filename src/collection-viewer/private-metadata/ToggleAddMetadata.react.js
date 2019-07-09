import React from 'react';

const Toggle = ({ toggle }) => (
  <button
    className="mdl-button mdl-button--fab mdl-button--mini-fab mdl-button--alt mdl-shadow--3dp pw-viewer-add-metadata-button"
    onClick={toggle}
    title="Add Metadata"
  >
    <i className="material-icons">note_add</i>
  </button>
);

export default Toggle;
