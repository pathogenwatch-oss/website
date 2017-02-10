import React from 'react';
import { connect } from 'react-redux';

import { uploadFiles } from '../thunks';

function mapDispatchToProps(dispatch, { genome }) {
  return {
    onClick: () => dispatch(uploadFiles([ genome ])),
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
