import './styles.css';

import React from 'react';
import { connect } from 'react-redux';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import FileCard from '../card/Card.react';
import AnalysisChart from './AnalysisChart.react';

import * as upload from './selectors';

const Analysis = ({ data }) => (
  <ul className="wgsa-upload-legend">
    { data.map(({ key, label, total, colour, ...analyses }) =>
      <li key={key}>
        <i className="material-icons" style={{ color: colour }}>stop</i>
        <strong>{label}</strong>: {total}
        <ul>
          {Object.keys(analyses).map(analysisKey => {
            const analysis = analyses[analysisKey];
            if (analysis.total) {
              return (
                <li key={analysisKey}>
                  {analysis.label}: {analysis.total === total ? '✔️' : `${analysis.total}/${total}`}
                </li>
              );
            }
            return null;
          })}
        </ul>
      </li>
    ) }
  </ul>
);

const Progress = ({ inProgress, errored, files, analysis, uploadedAt, isUploading, totalGenomes }) => (
  <div className="wgsa-content-margin wgsa-upload-progress">
    <div>
      <div className="wgsa-section-divider">
        <h2 className="wgsa-section-title">Files</h2>
        <ReactCSSTransitionGroup
          className="wgsa-upload-card-list"
          transitionName="wgsa-upload-card"
          transitionEnterTimeout={280}
          transitionLeave={false}
        >
          { inProgress.map(file => <FileCard key={file.id} item={file} />) }
        </ReactCSSTransitionGroup>
        { files.pending > 0 &&
          <p>
            +{files.pending} file{files.pending === 1 ? '' : 's'}.
          </p> }
        { !isUploading && totalGenomes > 0 &&
          <p>
            {totalGenomes} file{totalGenomes === 1 ? '' : 's'} uploaded successfully.
          </p> }
      </div>
      { files.errored > 0 &&
        <div className="wgsa-section-divider">
          <h2 className="wgsa-section-title">Errors</h2>
          { errored.map(file => <FileCard key={file.id} item={file} />) }
        </div> }
      { (!!analysis.length && analysis[0].key !== 'pending') &&
        <div className="wgsa-section-divider">
          <h2 className="wgsa-section-title">Organisms</h2>
          <Analysis data={analysis} />
        </div> }
    </div>
    <div className="wgsa-section-divider">
      <h2 className="wgsa-section-title">Analysis</h2>
      <AnalysisChart uploadedAt={uploadedAt} />
    </div>
  </div>
);

function mapStateToProps(state) {
  return {
    inProgress: upload.getFilesInProgress(state),
    errored: upload.getErroredUploads(state),
    files: upload.getFileSummary(state),
    analysis: upload.getAnalysisSummary(state),
    isUploading: upload.isUploading(state),
    totalGenomes: upload.getUploadedGenomeList(state).length,
  };
}

export default connect(mapStateToProps)(Progress);
