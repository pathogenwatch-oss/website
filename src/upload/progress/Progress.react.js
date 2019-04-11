import './styles.css';

import React from 'react';
import { connect } from 'react-redux';

import { Files, Errors } from './files';
import Overview from './Overview.react';
import SpeciesBreakdown from './SpeciesBreakdown.react';
import AnalysisChart from './analysis/AnalysisChart.react';
import AssemblyStatus from './assembly/AssemblyStatus.react';

import * as file from './files/selectors';
import { getAnalysisSummary } from './analysis/selectors';

const Progress = ({
  analysis,
  errored,
  files,
  uploadedAt,
  uploadsInProgress,
}) => (
  <div className="wgsa-upload-progress pw-upload-page">
    <AssemblyStatus uploadedAt={uploadedAt} />
    <div>
      <div className="wgsa-section-divider">
        <Files pending={files.pending} uploadsInProgress={uploadsInProgress} />
        <Overview />
      </div>
      <Errors genomes={errored} />
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
    errored: file.getInvalidUploads(state),
    files: file.getFileSummary(state),
    uploadsInProgress: file.getUploadsInProgress(state),
  };
}

export default connect(mapStateToProps)(Progress);
