import './styles.css';

import React from 'react';
import { connect } from 'react-redux';

import ProgressBar from '../progress-bar';

import * as upload from './selectors';

import { statuses } from './constants';

function showFileProgress({ id, name, status, progress }) {
  let content;

  if (status === statuses.COMPRESSING) {
    content = (
      <div>
        <ProgressBar indeterminate />
        <small>Compressing</small>
      </div>
    );
  }

  if (status === statuses.UPLOADING) {
    content = (
      <div>
        <ProgressBar progress={progress} />
        <small>Uploading</small>
      </div>
    );
  }

  return (
    <div key={id}>
      <h3>{name}</h3>
      { content }
    </div>
  );
}

const Progress = ({ inProgress, batchSize, completedUploads }) => (
  <section className="wgsa-page wgsa-upload-progress">
    <h1>Upload in Progress</h1>
    <div className="mdl-grid">
      <div className="mdl-cell mdl-cell--3-col">
        <div className="wgsa-section-divider">
          <h2 className="wgsa-section-title">Pending</h2>
          <span className="wgsa-figure">
            {batchSize - completedUploads}
          </span>
        </div>
      </div>
      <div className="mdl-cell mdl-cell--6-col">
        <div className="wgsa-section-divider">
          <h2 className="wgsa-section-title">In Progress</h2>
          {inProgress.map(showFileProgress)}
        </div>
      </div>
      <div className="mdl-cell mdl-cell--3-col">
        <div className="wgsa-section-divider">
          <h2 className="wgsa-section-title">Completed</h2>
          <span className="wgsa-figure">
            {completedUploads}
          </span>
        </div>
      </div>
    </div>
  </section>
);

function mapStateToProps(state) {
  return {
    files: upload.getUploadedGenomeList(state),
    isUploading: upload.isUploading(state),
    batchSize: upload.getBatchSize(state),
    completedUploads: upload.getNumCompletedUploads(state),
    totalErroredUploads: upload.getTotalErrors(state),
    inProgress: upload.getFilesInProgress(state),
  };
}

export default connect(mapStateToProps)(Progress);
