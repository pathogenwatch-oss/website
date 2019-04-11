import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

import * as upload from './selectors';
import * as files from './files/selectors';
import { getQueuePosition } from './analysis/selectors';

const AssemblyStage = ({ complete, total }) => {
  if (complete === total) {
    return (
      <p className="pw-with-icon success">
        <i className="material-icons">check_circle</i>
        {total} genome{total === 1 ? '' : 's'} assembled
      </p>
    );
  }
  return (
    <p className="pw-with-icon">
      Assembly
      <span className="wgsa-upload-legend-count">
        <strong>{complete}</strong> of <strong>{total}</strong>
      </span>
    </p>
  );
};

const AnalysisStage = ({ complete, total, hasErrors }) => {
  if (complete === total) {
    return (
      <p className={classnames('pw-with-icon', { success: !hasErrors })}>
        <i className="material-icons">
          {hasErrors ? 'warning' : 'check_circle'}
        </i>
        {total} analyses completed{hasErrors && ', with errors'}
      </p>
    );
  }
  return (
    <p className="pw-with-icon">
      Analysis
      <span className="wgsa-upload-legend-count">
        <strong>{complete}</strong> of <strong>{total}</strong>
      </span>
    </p>
  );
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
  } = props;
  if (isUploading || totalGenomes === 0) return null;

  const { assembly, analyses } = progress;

  const assemblyComplete = hasReads ? assembly.done === assembly.total : true;

  return (
    <div className="wgsa-upload-progress-overview">
      <p className="pw-with-icon success">
        <i className="material-icons">check_circle</i>
        {totalGenomes} genome{totalGenomes === 1 ? '' : 's'} uploaded
      </p>
      {hasReads && (
        <AssemblyStage complete={assembly.done} total={totalGenomes} />
      )}
      {analyses.total > 0 && (
        <AnalysisStage
          complete={analyses.done}
          total={analyses.total}
          hasErrors={hasErrors}
        />
      )}
      {assemblyComplete && analyses.done < analyses.total && (
        <QueuePosition position={position} />
      )}
    </div>
  );
};

function mapStateToProps(state) {
  return {
    hasErrors: upload.hasErrors(state),
    hasReads: files.hasReads(state),
    isUploading: files.isUploading(state),
    position: getQueuePosition(state),
    progress: upload.getOverallProgress(state),
    totalGenomes: files.getUploadedGenomeList(state).length,
  };
}

export default connect(mapStateToProps)(Overview);
