import React from 'react';
import { connect } from 'react-redux';

import ProgressBar from '../../components/progress-bar';

import * as upload from './selectors';

const AssemblyStage = ({ percentage, totalGenomes }) => {
  if (percentage === 100) {
    return (
      <p className="pw-with-success-icon">
        <i className="material-icons">check_circle</i>
        {totalGenomes} genome{totalGenomes === 1 ? '' : 's'} assembled
      </p>
    );
  }
  return <ProgressBar label="Assembly" progress={percentage} />;
};

const AnalysisStage = ({ percentage, totalAnalyses, hasErrors }) => {
  if (percentage === 100) {
    return (
      <p className="pw-with-success-icon">
        <i className="material-icons">
          {hasErrors ? 'warning' : 'check_circle'}
        </i>
        {totalAnalyses} analyses completed{hasErrors && ', with errors'}
      </p>
    );
  }
  return <ProgressBar label="Analysis" progress={percentage} />;
};

const QueuePosition = ({ position }) => {
  if (position === 0) {
    return <p className="wgsa-blink">Results processing</p>;
  }
  return (
    <p>
      {position} job{position === 1 ? '' : 's'} till next result
    </p>
  );
};

const Overview = props => {
  const {
    hasErrors,
    hasReads,
    isUploading,
    position,
    progress,
    totalGenomes,
    assemblyProgress,
  } = props;
  if (isUploading || totalGenomes === 0) return null;

  const { analyses } = progress;

  const assemblyPct = hasReads ? assemblyProgress : 100;
  const analysisPct = (analyses.done / analyses.total) * 100;

  return (
    <div className="wgsa-upload-progress-overview">
      <p className="pw-with-success-icon">
        <i className="material-icons">check_circle</i>
        {totalGenomes} genome{totalGenomes === 1 ? '' : 's'} uploaded
      </p>
      {hasReads && (
        <AssemblyStage percentage={assemblyPct} totalGenomes={totalGenomes} />
      )}
      <AnalysisStage
        percentage={analysisPct}
        totalAnalyses={analyses.total}
        hasErrors={hasErrors}
      />
      {assemblyPct === 100 && analysisPct < 100 && (
        <QueuePosition position={position} />
      )}
    </div>
  );
};

function mapStateToProps(state) {
  return {
    hasErrors: upload.hasErrors(state),
    hasReads: upload.hasReads(state),
    isUploading: upload.isUploading(state),
    position: upload.getQueuePosition(state),
    progress: upload.getOverallProgress(state),
    totalGenomes: upload.getUploadedGenomeList(state).length,
    assemblyProgress: upload.getAssemblyProgress(state),
  };
}

export default connect(mapStateToProps)(Overview);
