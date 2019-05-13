import React from 'react';
import { connect } from 'react-redux';

import { getUploadErrors } from './selectors';
import { InvalidGenomeError } from './utils/validation';

const UploadErrors = ({ errors, numOtherErrors }) => (
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
            {numOtherErrors} file{numOtherErrors === 1 ? '' : 's'} failed to
            upload
          </h5>
        </div>
      </article>
    )}
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
  };
}

export default connect(mapStateToProps)(UploadErrors);
