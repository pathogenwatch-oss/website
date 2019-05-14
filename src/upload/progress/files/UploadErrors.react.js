import React from 'react';
import { connect } from 'react-redux';

import { getUploadErrors, isUploadPending } from './selectors';

import { InvalidGenomeError } from './utils/validation';

const reload = e => {
  e.preventDefault();
  window.location.reload();
};

const UploadErrors = ({ errors, numOtherErrors, uploadPending }) => (
  <section>
    {errors.map(({ filename, error }) => (
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
      {!uploadPending && (
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
  const errors = [];
  let numOtherErrors = 0;
  for (const item of getUploadErrors(state)) {
    if (item.error instanceof InvalidGenomeError) {
      errors.push(item);
    } else {
      numOtherErrors++;
    }
  }
  return {
    errors,
    numOtherErrors,
    uploadPending: isUploadPending(state),
  };
}

export default connect(mapStateToProps)(UploadErrors);
