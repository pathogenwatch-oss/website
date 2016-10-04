import '../css/card.css';

import React from 'react';
import { connect } from 'react-redux';

import FastaCard from './FastaCard.react';

import { uploadFiles } from '../thunks';

import { fastaValidationErrors as errors } from '../utils/fasta';
import config from '../../config';

const Error = ({ message, children }) => (
  <div className="wgsa-hub-card__metadata wgsa-hub-card-error">
    <i className="material-icons">warning</i>
    <p>{message}</p>
    {children}
  </div>
);

function mapDispatchToProps(dispatch, { file }) {
  return {
    onClick: () => dispatch(uploadFiles([ file ])),
  };
}

const RetryButton = connect(null, mapDispatchToProps)(({ onClick }) => (
  <button className="mdl-button mdl-button--primary" onClick={onClick}>
    Retry
  </button>
));

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
        <Error message="File could not be uploaded.">
          <RetryButton file={file} />
        </Error>
      );
  }
}

export default (file) => (
  <FastaCard name={file.name}>
    { getError(file) }
  </FastaCard>
);
