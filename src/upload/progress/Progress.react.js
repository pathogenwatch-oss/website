import './styles.css';

import React from 'react';
import { connect } from 'react-redux';
import { Prompt } from 'react-router-dom';

import Files from './files';
import Overview from './Overview.react';
import SpeciesBreakdown from './SpeciesBreakdown.react';
import AnalysisChart from './analysis/AnalysisChart.react';
import AnalysisListener from './analysis/Listener.react';
import AssemblyStatus from './assembly/AssemblyStatus.react';
import Fade from '~/components/fade';
import UploadErrors from './files/UploadErrors.react';

import { getUploadsInProgress, shouldShowUploadErrors } from './selectors';
import { getStatusSummary, isUploadPending, hasReads } from './files/selectors';
import { getSpeciesBreakdown } from './analysis/selectors';

const Progress = ({
  files,
  sessionHasReads,
  showErrors,
  speciesBreakdown,
  uploadedAt,
  uploadsInProgress,
  uploadsPending,
}) => (
  <div className="wgsa-upload-progress pw-upload-page">
    <Prompt
      when={uploadsPending}
      message={`
        Your upload is not complete.
        Return to "Previous Uploads" to resume this session at a later date.
      `}
    />
    <AnalysisListener uploadedAt={uploadedAt} />
    { sessionHasReads && <AssemblyStatus uploadedAt={uploadedAt} /> }
    <div>
      <div className="wgsa-section-divider">
        {uploadsPending ? (
          <Files
            pending={files.pending}
            uploadsInProgress={uploadsInProgress}
          />
        ) : (
          <Overview completedUploads={files.completed} />
        )}
      </div>
      {!!speciesBreakdown.length && speciesBreakdown[0].key !== 'pending' && (
        <div className="wgsa-section-divider">
          <SpeciesBreakdown data={speciesBreakdown} />
        </div>
      )}
    </div>
    <div className="wgsa-section-divider wgsa-flex-section">
      <Fade className="pw-expand">
        {showErrors ? (
          <UploadErrors key="errors" />
        ) : (
          <AnalysisChart key="analysis" uploadedAt={uploadedAt} />
        )}
      </Fade>
    </div>
  </div>
);

function mapStateToProps(state) {
  return {
    files: getStatusSummary(state),
    sessionHasReads: hasReads(state),
    showErrors: shouldShowUploadErrors(state),
    speciesBreakdown: getSpeciesBreakdown(state),
    uploadsInProgress: getUploadsInProgress(state),
    uploadsPending: isUploadPending(state),
  };
}

export default connect(mapStateToProps)(Progress);
