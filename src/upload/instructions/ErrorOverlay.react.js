import React from 'react';
import { connect } from 'react-redux';

import Overlay from '../../components/overlay';

import { uploadValidationError } from './actions';

const ErrorOverlay = ({ message, clearMessage }) => (
  <Overlay visible={message} hide={clearMessage}>
    {message && (
      <div className="pw-upload-message" onClick={e => e.stopPropagation()}>
        <p className="h4 title-font">Sorry, there was a problem.</p>
        <p>{message}</p>
        <footer>
          <button
            className="mdl-button mdl-button--raised mdl-button--colored"
            onClick={clearMessage}
          >
            Ok
          </button>
        </footer>
      </div>
    )}
  </Overlay>
);

function mapStateToProps(state) {
  return {
    message: state.upload.instructions.message,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    clearMessage: () => dispatch(uploadValidationError(null)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ErrorOverlay);
