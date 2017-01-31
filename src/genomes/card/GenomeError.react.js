import React from 'react';

import { genomeValidationErrors as errors } from '../utils/validation';
import config from '../../app/config';

const Error = ({ message, children }) => (
  <div className="wgsa-hub-card__metadata wgsa-hub-card-error">
    <i className="material-icons">warning</i>
    <p>{message}</p>
    {children}
  </div>
);

function getError(file) {
  switch (file.error) {
    case errors.INVALID_GENOME_CONTENT:
      return <Error message="This is not a valid genome file." />;
    case errors.INVALID_GENOME_SIZE:
      return <Error message={`This file is larger than ${config.maxGenomeFileSize} MB.`} />;
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
