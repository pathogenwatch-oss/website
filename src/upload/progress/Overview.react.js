import React from 'react';
import { connect } from 'react-redux';

import ProgressBar from '../../components/progress-bar';

import * as upload from './selectors';

export default connect(state => ({
  complete: upload.isAnalysisComplete(state),
  hasErrors: upload.hasErrors(state),
  hasReads: upload.hasReads(state),
  isUploading: upload.isUploading(state),
  position: upload.getQueuePosition(state),
  progress: upload.getOverallProgress(state),
  totalGenomes: upload.getUploadedGenomeList(state).length,
}))(props => {
  const {
    complete,
    hasErrors,
    hasReads,
    isUploading,
    position,
    progress,
    totalGenomes,
  } = props;
  if (isUploading || totalGenomes === 0) return null;

  const { assembly, speciation, tasks } = progress;

  const assemblyPct = hasReads ? (assembly.done / totalGenomes) * 100 : 100;
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
      <p className="pw-with-success-icon">
        Uploaded {totalGenomes} genome{totalGenomes === 1 ? '' : 's'}
        <i className="material-icons">check_circle</i>
      </p>
      {hasReads && <ProgressBar label="Assembly" progress={assemblyPct} />}
      <ProgressBar label="Speciation" progress={speciationPct} />
      <ProgressBar label="Analysis" progress={tasksPct} />
      {assemblyPct === 100 && position > 0 && (
        <p>
          {position} job{position === 1 ? '' : 's'} till next result.
        </p>
      )}
      {assemblyPct === 100 && position === 0 && (
        <p className="wgsa-blink">Results processing.</p>
      )}
    </div>
  );
});
