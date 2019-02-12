import React from 'react';
import { connect } from 'react-redux';

import ProgressBar from '../../components/progress-bar';

import * as upload from './selectors';

export default connect(state => ({
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

    console.log('success');

    return (
      <div className="wgsa-upload-progress-overview">
        <p>
          {totalGenomes} genome{totalGenomes === 1 ? '' : 's'} uploaded
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
