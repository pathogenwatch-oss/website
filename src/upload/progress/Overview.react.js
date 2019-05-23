import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

import * as upload from './selectors';
import * as files from './files/selectors';
import { getQueuePosition } from './analysis/selectors';
import { getAssemblyPending } from './assembly/selectors';
import { getBatchSize } from './genomes/selectors';

const AssemblyStage = ({ complete, total, hasErrors }) => {
  if (complete === total) {
    return (
      <p className={classnames('pw-with-icon', { success: !hasErrors })} >
        <i className="material-icons">
          {hasErrors ? 'error_outline' : 'check_circle'}
        </i>
        {total.toLocaleString()} genome{total === 1 ? '' : 's'} assembled
      </p>
    );
  }
  return (
    <p className="pw-with-icon">
      Assembly
      <span className="wgsa-upload-legend-count">
        <strong>{complete.toLocaleString()}</strong> of <strong>{total.toLocaleString()}</strong>
      </span>
    </p>
  );
};

const AnalysisStage = ({ complete, total, hasErrors }) => {
  if (complete === total) {
    return (
      <p className={classnames('pw-with-icon', { success: !hasErrors })}>
        <i className="material-icons">
          {hasErrors ? 'error_outline' : 'check_circle'}
        </i>
        {total.toLocaleString()} {total === 1 ? 'analysis' : 'analyses'} completed
      </p>
    );
  }
  return (
    <p className="pw-with-icon">
      Analysis
      <span className="wgsa-upload-legend-count">
        <strong>{complete.toLocaleString()}</strong> of <strong>{total.toLocaleString()}</strong>
      </span>
    </p>
  );
};

const QueuePosition = ({ position }) => {
  if (position === 0) {
    return <p className="wgsa-blink">Results processing</p>;
  }
  if (position) {
    return (
      <p>
        {position.toLocaleString()} job{position === 1 ? '' : 's'} till next result
      </p>
    );
  }
  return null;
};

const Overview = props => {
  const {
    assemblyQueued,
    hasErrors,
    hasReads,
    position,
    progress,
    totalGenomes,
    completedUploads,
  } = props;
  if (totalGenomes === 0) return null;

  const { assembly, analyses, speciation } = progress;

  const assemblyComplete = hasReads ? assembly.done === assembly.total : true;
  const speciationComplete = speciation.done === totalGenomes;
  const analysisPending =
    completedUploads > 0 &&
    (hasReads ? assembly.complete > 0 : true) &&
    (analyses.total === 0 || analyses.done < analyses.total);

  return (
    <div className="wgsa-upload-progress-overview">
      <p
        className={classnames('pw-with-icon', {
          success: completedUploads === totalGenomes,
        })}
      >
        <i className="material-icons">
          {completedUploads === totalGenomes ? 'check_circle' : 'error_outline'}
        </i>
        {completedUploads === 0
          ? 'No successful uploads'
          : `${completedUploads.toLocaleString()} genome${
            completedUploads === 1 ? '' : 's'
          } uploaded`}
      </p>
      {hasReads && (
        <AssemblyStage
          complete={assembly.done}
          total={assembly.total}
          hasErrors={assembly.failed > 0}
        />
      )}
      {speciationComplete && analyses.total > 0 && (
        <AnalysisStage
          complete={analyses.done}
          total={analyses.total}
          hasErrors={hasErrors}
        />
      )}
      {assemblyQueued > 0 && (
        <p className="wgsa-blink">
          {assemblyQueued} job{assemblyQueued === 1 ? '' : 's'} queued
        </p>
      )}
      {assemblyComplete && analysisPending && (
        <QueuePosition position={position} />
      )}
    </div>
  );
};

function mapStateToProps(state) {
  return {
    assemblyQueued: getAssemblyPending(state),
    hasErrors: upload.hasErrors(state),
    hasReads: files.hasReads(state),
    position: getQueuePosition(state),
    progress: upload.getOverallProgress(state),
    totalGenomes: getBatchSize(state),
  };
}

export default connect(mapStateToProps)(Overview);
