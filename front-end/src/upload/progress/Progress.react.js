import './styles.css';

import React from 'react';
import { connect } from 'react-redux';
import { Prompt } from 'react-router-dom';

import AnalysisChart from './analysis/AnalysisChart.react';
import AnalysisListener from './analysis/Listener.react';
import AssemblyStatus from './assembly/AssemblyStatus.react';
import Errors from './errors/Errors.react';
import Fade from '~/components/fade';
import Files from './files';
import Loading from '~/components/Loading.react';
import Overview from './Overview.react';
import SpeciesBreakdown from './SpeciesBreakdown.react';
import Spinner from '~/components/Spinner.react';

import { getUploadsInProgress, isLoading } from './selectors';
import { getStatusSummary, isUploadPending } from './files/selectors';
import { shouldShowSpeciesBreakdown } from './analysis/selectors';
import { shouldShowErrors } from './errors/selectors';
import { hasReads } from './genomes/selectors';

const Progress = ({
  files,
  sessionIsLoading,
  sessionHasReads,
  showErrors,
  showSpeciesBreakdown,
  uploadedAt,
  uploadsInProgress,
  uploadsPending,
}) => (
  <React.Fragment>
    <AnalysisListener uploadedAt={uploadedAt} />
    { sessionHasReads && <AssemblyStatus uploadedAt={uploadedAt} /> }
    <Loading
      complete={!sessionIsLoading}
      placeholder={<div className="pw-centre-text"><Spinner /></div>}
    >
      <div className="wgsa-upload-progress pw-upload-page">
        <Prompt
          when={uploadsPending}
          message={`
          Your upload is not complete.
          Return to "Previous Uploads" to resume this session at a later date.
        `}
        />
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
          {showSpeciesBreakdown && (
            <div className="wgsa-section-divider">
              <SpeciesBreakdown />
            </div>
          )}
        </div>
        <div className="wgsa-section-divider wgsa-flex-section">
          <Fade className="pw-expand">
            {showErrors ? (
              <Errors key="errors" />
            ) : (
              <AnalysisChart key="analysis" uploadedAt={uploadedAt} />
            )}
          </Fade>
        </div>
      </div>
    </Loading>
  </React.Fragment>
);

function mapStateToProps(state) {
  return {
    files: getStatusSummary(state),
    sessionIsLoading: isLoading(state),
    sessionHasReads: hasReads(state),
    showErrors: shouldShowErrors(state),
    showSpeciesBreakdown: shouldShowSpeciesBreakdown(state),
    uploadsInProgress: getUploadsInProgress(state),
    uploadsPending: isUploadPending(state),
  };
}

export default connect(mapStateToProps)(Progress);
