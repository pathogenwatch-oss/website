import React from 'react';
import { connect } from 'react-redux';

import {
  getNumOtherErrors,
  getValidationErrors,
  isUploadPending,
} from '../files/selectors';
import { getAssemblerErrors } from '../assembly/selectors';

const reload = e => {
  e.preventDefault();
  window.location.reload();
};

const Errors = ({ assemblerErrors, validationErrors, numOtherErrors, uploadPending }) => (
  <section>
    {assemblerErrors.map(({ name }) => (
      <article key={name} className="pw-upload-file-error">
        <i className="material-icons">error_outline</i>
        <div>
          <h5>{name}</h5>
          <p>There was a problem during assembly</p>
        </div>
      </article>
    ))}
    {validationErrors.map(({ filename, error }) => (
      <article key={filename} className="pw-upload-file-error">
        <i className="material-icons">error_outline</i>
        <div>
          <h5>{filename}</h5>
          <p>{error.message}</p>
        </div>
      </article>
    ))}
    {numOtherErrors > 0 && (
      <article className="pw-upload-file-error">
        <i className="material-icons">error_outline</i>
        <div>
          <h5>
            {numOtherErrors} genome{numOtherErrors === 1 ? ' was ' : 's were '}
            interrupted during upload
          </h5>
        </div>
      </article>
    )}
    <footer className="pw-upload-file-error-footer">
      {!uploadPending && (validationErrors.length > 0 || numOtherErrors > 0) && (
        <a
          className="mdl-button mdl-button--raised mdl-button--colored"
          href="#"
          onClick={reload}
        >
          Reload page
        </a>
      )}
    </footer>
  </section>
);

function mapStateToProps(state) {
  return {
    assemblerErrors: getAssemblerErrors(state),
    numOtherErrors: getNumOtherErrors(state),
    uploadPending: isUploadPending(state),
    validationErrors: getValidationErrors(state),
  };
}

export default connect(mapStateToProps)(Errors);
