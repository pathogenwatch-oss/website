import './styles.css';

import React from 'react';
import { connect } from 'react-redux';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import FileCard from '../card/Card.react';
import AnalysisChart from './AnalysisChart.react';
import ProgressBar from '../../components/progress-bar';

import * as upload from './selectors';

import { analysisLabels } from '../../app/constants';

const Analysis = ({ data, showBreakdown }) => (
  <ul className="wgsa-upload-legend">
    {data.map(({ key, label, total, colour, ...analyses }) => (
      <li key={key}>
        <span>
          <i className="material-icons" style={{ color: colour }}>
            stop
          </i>
          <strong className="wgsa-upload-legend-organism" title={label}>
            {label}
          </strong>
          &nbsp;({total})
        </span>
        {showBreakdown && (
          <ul>
            {Object.keys(analyses).map(analysisKey => {
              const analysis = analyses[analysisKey];
              if (analysisKey in analysisLabels) {
                return (
                  <li key={analysisKey}>
                    {analysis.total === total ? (
                      <React.Fragment>
                        {analysisLabels[analysisKey]}
                        <i className="material-icons">check_circle</i>
                      </React.Fragment>
                    ) : (
                      `${analysisLabels[analysisKey]}: ${
                        analysis.total
                      } / ${total}`
                    )}
                    {analysis.errors > 0 && (
                      <small>
                        &nbsp;{analysis.errors} error
                        {analysis.errors === 1 ? '' : 's'}
                      </small>
                    )}
                  </li>
                );
              }
              return null;
            })}
          </ul>
        )}
      </li>
    ))}
  </ul>
);

const Overview = connect(state => ({
  isUploading: upload.isUploading(state),
  totalGenomes: upload.getUploadedGenomeList(state).length,
  progress: upload.getOverallProgress(state),
  complete: upload.isAnalysisComplete(state),
  position: upload.getQueuePosition(state),
  hasErrors: upload.hasErrors(state),
}))(
  ({ isUploading, totalGenomes, progress, complete, position, hasErrors }) => {
    if (isUploading || totalGenomes === 0) return null;

    const { speciation, tasks } = progress;

    const speciationPct = (speciation.done / totalGenomes) * 100;
    const tasksPct = (tasks.done / tasks.total) * 100;

    if (complete && hasErrors) {
      return <strong>Analysis complete, with errors.</strong>;
    }

    if (complete) {
      return <strong>Analysis complete 🎉</strong>;
    }

    return (
      <div className="wgsa-upload-progress-overview">
        <p>
          {totalGenomes} file{totalGenomes === 1 ? '' : 's'} uploaded
          successfully.
        </p>
        <ProgressBar label="Speciation" progress={speciationPct} />
        {speciationPct === 100 && (
          <ProgressBar label="Tasks" progress={tasksPct} />
        )}
        {position > 0 ? (
          <p>
            {position} job{position === 1 ? '' : 's'} till next result.
          </p>
        ) : (
          <p className="wgsa-blink">Results processing.</p>
        )}
      </div>
    );
  }
);

const Progress = ({
  inProgress,
  errored,
  files,
  analysis,
  uploadedAt,
  specieationComplete,
}) => (
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
          {inProgress.map(file => (
            <FileCard key={file.id} item={file} />
          ))}
        </ReactCSSTransitionGroup>
        {files.pending > 0 && (
          <p>
            +{files.pending} file{files.pending === 1 ? '' : 's'}.
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
          <h2 className="wgsa-section-title">Organisms</h2>
          <Analysis data={analysis} showBreakdown={specieationComplete} />
        </div>
      )}
    </div>
    <div className="wgsa-section-divider wgsa-flex-section">
      <h2 className="wgsa-section-title">Analysis</h2>
      <AnalysisChart uploadedAt={uploadedAt} />
    </div>
  </div>
);

function mapStateToProps(state) {
  return {
    inProgress: upload.getFilesInProgress(state),
    errored: upload.getInvalidUploads(state),
    files: upload.getFileSummary(state),
    analysis: upload.getAnalysisSummary(state),
    specieationComplete: upload.isSpecieationComplete(state),
  };
}

export default connect(mapStateToProps)(Progress);
