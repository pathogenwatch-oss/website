import './styles.css';

import React from 'react';
import { connect } from 'react-redux';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import FileCard from '../card/Card.react';
import AnalysisChart from './AnalysisChart.react';
import ProgressBar from '../../progress-bar';

import * as upload from './selectors';

const Analysis = ({ data, showBreakdown }) => (
  <ul className="wgsa-upload-legend">
    { data.map(({ key, label, total, colour, ...analyses }) =>
      <li key={key}>
        <i className="material-icons" style={{ color: colour }}>stop</i>
        <strong>{label}</strong>: {total}
        { showBreakdown &&
          <ul>
            {Object.keys(analyses).map(analysisKey => {
              const analysis = analyses[analysisKey];
              if (analysis.active) {
                return (
                  <li key={analysisKey}>
                    { analysis.total === total ?
                      `${analysis.label} ✔️` :
                      `${analysis.label}: ${analysis.total}/${total}` }
                  </li>
                );
              }
              return null;
            })}
          </ul> }
      </li>
    ) }
  </ul>
);

const Overview = connect(
  state => ({
    isUploading: upload.isUploading(state),
    totalGenomes: upload.getUploadedGenomeList(state).length,
    progress: upload.getOverallProgress(state),
    complete: upload.isAnalysisComplete(state),
    position: upload.getQueuePosition(state),
  })
)(({ isUploading, totalGenomes, progress, complete, position }) => {
  if (isUploading || totalGenomes === 0) return null;

  const { speciation, tasks } = progress;

  const speciationPct = speciation.done / totalGenomes * 100;
  const tasksPct = tasks.done / tasks.total * 100;

  if (complete) {
    return <strong>Analysis Complete 🎉</strong>;
  }

  return (
    <div className="wgsa-upload-progress-overview">
      <p>
        {totalGenomes} file{totalGenomes === 1 ? '' : 's'} uploaded successfully.
      </p>
      <ProgressBar label="Speciation" progress={speciationPct} />
      { speciationPct === 100 &&
        <ProgressBar label="Tasks" progress={tasksPct} /> }
      { position > 0 && <p>{position} jobs till next result.</p> }
    </div>
  );
});

const Progress = ({ inProgress, errored, files, analysis, uploadedAt, specieationComplete }) => (
  <div className="wgsa-content-margin wgsa-upload-progress">
    <div>
      <div className="wgsa-section-divider">
        <h2 className="wgsa-section-title">Progress</h2>
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
        <Overview />
      </div>
      { files.errored > 0 &&
        <div className="wgsa-section-divider">
          <h2 className="wgsa-section-title">Errors</h2>
          { errored.map(file => <FileCard key={file.id} item={file} />) }
        </div> }
      { (!!analysis.length && analysis[0].key !== 'pending') &&
        <div className="wgsa-section-divider">
          <h2 className="wgsa-section-title">Organisms</h2>
          <Analysis data={analysis} showBreakdown={specieationComplete} />
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
    specieationComplete: upload.isSpecieationComplete(state),
  };
}

export default connect(mapStateToProps)(Progress);
