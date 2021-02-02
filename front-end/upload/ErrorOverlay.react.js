import React from 'react';
import { connect } from 'react-redux';

import Overlay from '../components/overlay';

import { uploadErrorMessage } from './actions';

const limit = 5;

const messageTypes = {
  MISSING_FILES: data => (
    <React.Fragment>
      <p>These files are still missing:</p>
      <ul>
        {data.slice(0, limit).map(filename => (
          <li>{filename}</li>
        ))}
        {data.length > limit && <li>+{data.length - limit} more</li>}
      </ul>
      <p>if the problem persists, please try a new upload.</p>
    </React.Fragment>
  ),
};

const ErrorOverlay = ({ message, clearMessage }) => (
  <Overlay visible={!!message} hide={clearMessage}>
    {message && (
      <div className="pw-upload-message" onClick={e => e.stopPropagation()}>
        <span className="wgsa-file-icon">
          <i className="material-icons">warning</i>
        </span>
        {message.type ? (
          messageTypes[message.type](message.data)
        ) : (
          <p>{message}</p>
        )}
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
    message: state.upload.errorMessage,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    clearMessage: () => dispatch(uploadErrorMessage(null)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ErrorOverlay);
