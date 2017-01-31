import React from 'react';

import { fastaValidationErrors as errors } from '../genomes/utils/fasta';
import config from '../app/config';

const Error = ({ message, children }) => (
  <div className="wgsa-hub-card__metadata wgsa-hub-card-error">
    <i className="material-icons">warning</i>
    <p>{message}</p>
    {children}
  </div>
);

function getError(file) {
  switch (file.error) {
    case errors.INVALID_FASTA_CONTENT:
      return <Error message="This is not a valid fasta file." />;
    case errors.INVALID_FASTA_SIZE:
      return <Error message={`This file is larger than ${config.maxFastaFileSize} MB.`} />;
    case errors.EMPTY_FILE:
      return <Error message="This is an empty file." />;
    default:
      return (
        <Error message="File could not be uploaded." />
      );
  }
}

export default (file) => (
  <div className="wgsa-card-content">
    { getError(file) }
  </div>
);
