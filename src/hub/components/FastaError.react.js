import '../css/card.css';

import React from 'react';

import FastaCard from './FastaCard.react';

import { fastaValidationErrors as errors } from '../utils/fasta';
import config from '../../config';

const Error = ({ message, children }) => (
  <div className="wgsa-hub-card__metadata wgsa-hub-card-error">
    <i className="material-icons">warning</i>
    <p>{message}</p>
    {children}
  </div>
);

function getError(error) {
  switch (error) {
    case errors.INVALID_FASTA_CONTENT:
      return <Error message="This is not a valid fasta file." />;
    case errors.INVALID_FASTA_SIZE:
      return <Error message={`This file is larger than ${config.maxFastaFileSize} MB.`} />;
    case errors.EMPTY_FILE:
      return <Error message="This is an empty file." />;
    default:
      return (
        <Error message="Upload failed, please retry.">
          <button title="Retry" className="mdl-button mdl-button--icon">
            <i className="material-icons">replay</i>
          </button>
        </Error>
      );
  }
}

export default ({ name, error }) => (
  <FastaCard name={name}>
    { getError(error) }
  </FastaCard>
);
