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

import * as file from './files/selectors';
import { getAnalysisSummary } from './analysis/selectors';

const Progress = ({ analysis, files, uploadedAt, uploadsInProgress }) => (
  <div className="wgsa-upload-progress pw-upload-page">
    <Prompt
      when={files.pending > 0}
      message={`
        Are you sure you want to leave the page?
        You will need to re-upload your files at a later time.
      `}
    />
    <AnalysisListener uploadedAt={uploadedAt} />
    <AssemblyStatus uploadedAt={uploadedAt} />
    <div>
      <div className="wgsa-section-divider">
        <Files pending={files.pending} uploadsInProgress={uploadsInProgress} />
        <Overview />
      </div>
      {!!analysis.length && analysis[0].key !== 'pending' && (
        <div className="wgsa-section-divider">
          <SpeciesBreakdown data={analysis} />
        </div>
      )}
    </div>
    <div className="wgsa-section-divider wgsa-flex-section">
      <AnalysisChart uploadedAt={uploadedAt} />
    </div>
  </div>
);

function mapStateToProps(state) {
  return {
    analysis: getAnalysisSummary(state),
    files: file.getStatusSummary(state),
    uploadsInProgress: file.getUploadsInProgress(state),
  };
}

export default connect(mapStateToProps)(Progress);
