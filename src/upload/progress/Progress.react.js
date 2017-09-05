import './styles.css';

import React from 'react';
import { connect } from 'react-redux';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import FileCard from '../card/Card.react';
import AnalysisChart from './AnalysisChart.react';

import * as upload from './selectors';

const Analysis = ({ data }) => (
  <ul>
    { data.map(({ key, label, total, ...analyses }) =>
      <li key={key}>
        <strong>{label}</strong>: {total}
        <ul>
          {Object.keys(analyses).map(analysisKey => {
            const analysis = analyses[analysisKey];
            if (analysis.total) {
              return (
                <li key={analysisKey}>
                  {analysis.label}: {analysis.total}/{total}
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

const Progress = ({ inProgress, errored, files, analysis, uploadedAt }) => (
  <div className="wgsa-content-margin wgsa-upload-progress">
    <div>
      { files.pending > 0 &&
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
          <p>
            +{files.pending} file{files.pending === 1 ? '' : 's'}.
          </p>
        </div> }
      { (!!analysis.length && analysis[0].key !== 'pending') &&
        <div className="wgsa-section-divider">
          <h2 className="wgsa-section-title">Organisms</h2>
          <Analysis data={analysis} />
        </div> }
      { files.errored > 0 &&
        <div className="wgsa-section-divider">
          <h2 className="wgsa-section-title">Errors</h2>
          { errored.map(file => <FileCard key={file.id} item={file} />) }
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
  };
}

export default connect(mapStateToProps)(Progress);
