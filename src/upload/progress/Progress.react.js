import './styles.css';

import React from 'react';
import { connect } from 'react-redux';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import Overview from './Overview.react';
import SpeciesBreakdown from './SpeciesBreakdown.react';
import FileCard from '../card/Card.react';
import AnalysisChart from './AnalysisChart.react';

import * as upload from './selectors';
import { useAssemblyStatus } from './hooks';

const AssemblyStatus = connect(state => ({
  assemblyComplete: upload.isAssemblyComplete(state),
  assemblyInProgress: upload.isAssemblyInProgress(state),
  hasReads: upload.hasReads(state),
  token: state.auth.token,
}))(props => {
  useAssemblyStatus(props);
  return null;
});

const Progress = ({
  analysis,
  errored,
  files,
  uploadedAt,
  uploadsInProgress,
}) => (
  <div className="wgsa-upload-progress pw-upload-page">
    <AssemblyStatus uploadedAt={uploadedAt} />
    <div>
      <div className="wgsa-section-divider">
        {/* <h2 className="wgsa-section-title">Overview</h2> */}
        <ReactCSSTransitionGroup
          className="wgsa-upload-card-list"
          transitionName="wgsa-upload-card"
          transitionEnterTimeout={280}
          transitionLeave={false}
        >
          {uploadsInProgress.map(file => (
            <FileCard key={file.id} item={file} />
          ))}
        </ReactCSSTransitionGroup>
        {files.pending > 0 && (
          <p>
            +{files.pending} genome{files.pending === 1 ? '' : 's'}.
          </p>
        )}
        <Overview />
      </div>
      {files.errored > 0 && (
        <div className="wgsa-section-divider">
          <h2 className="wgsa-section-title">Validation Errors</h2>
          {errored.map(file => (
            <FileCard key={file.id} item={file} />
          ))}
        </div>
      )}
      {!!analysis.length && analysis[0].key !== 'pending' && (
        <div className="wgsa-section-divider">
          {/* <h2 className="wgsa-section-title">Organisms</h2> */}
          <SpeciesBreakdown data={analysis} />
        </div>
      )}
    </div>
    <div className="wgsa-section-divider wgsa-flex-section">
      {/* <h2 className="wgsa-section-title">Progress</h2> */}
      <AnalysisChart uploadedAt={uploadedAt} />
    </div>
  </div>
);

function mapStateToProps(state) {
  return {
    analysis: upload.getAnalysisSummary(state),
    errored: upload.getInvalidUploads(state),
    files: upload.getFileSummary(state),
    uploadsInProgress: upload.getGenomesInProgress(state),
  };
}

export default connect(mapStateToProps)(Progress);
