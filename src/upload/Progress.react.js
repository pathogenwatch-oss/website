import './styles.css';

import React from 'react';
import { connect } from 'react-redux';

import Grid from '../grid';
import Card from './card/Card.react';

import * as upload from './selectors';

const Progress = ({ files }) => (
  <Grid
    template={Card}
    items={files}
    columnWidth={256}
    rowHeight={160}
  />
);

function mapStateToProps(state) {
  return {
    files: upload.getUploadedGenomeList(state),
    isUploading: upload.isUploading(state),
    batchSize: upload.getBatchSize(state),
    completedUploads: upload.getNumCompletedUploads(state),
    totalErroredUploads: upload.getTotalErrors(state),
  };
}

export default connect(mapStateToProps)(Progress);
