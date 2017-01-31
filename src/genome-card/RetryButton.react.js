import React from 'react';
import { connect } from 'react-redux';

import { uploadFiles } from '../genomes/thunks';

function mapDispatchToProps(dispatch, { file }) {
  return {
    onClick: () => dispatch(uploadFiles([ file ])),
  };
}

export default connect(null, mapDispatchToProps)(({ onClick }) => (
  <button
    className="mdl-button mdl-button--primary wgsa-button--text"
    onClick={onClick}
  >
    Retry
  </button>
));
