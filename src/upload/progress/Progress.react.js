import './styles.css';

import React from 'react';
import { connect } from 'react-redux';

import { Files, Errors } from './files';
import Overview from './Overview.react';
import SpeciesBreakdown from './SpeciesBreakdown.react';
import AnalysisChart from './AnalysisChart.react';

import * as upload from './selectors';
import * as file from './files/selectors';
import { useAssemblyStatus } from './hooks';

const AssemblyStatus = connect(state => ({
  assemblyComplete: upload.isAssemblyComplete(state),
  assemblyInProgress: upload.isAssemblyInProgress(state),
  hasReads: upload.hasReads(state),
  token: state.auth.token,
}))(props => {
  useAssemblyStatus(props);
  return null;
});

const Progress = ({
  // analysis,
  errored,
  files,
  uploadedAt,
  uploadsInProgress,
}) => (
  <div className="wgsa-upload-progress pw-upload-page">
    {/* <AssemblyStatus uploadedAt={uploadedAt} /> */}
    <div>
      <div className="wgsa-section-divider">
        <Files pending={files.pending} uploadsInProgress={uploadsInProgress} />
        {/* <Overview /> */}
      </div>
      <Errors genomes={errored} />
      {/* {!!analysis.length && analysis[0].key !== 'pending' && (
        <div className="wgsa-section-divider">
          <SpeciesBreakdown data={analysis} />
        </div>
      )} */}
    </div>
    <div className="wgsa-section-divider wgsa-flex-section">
      {/* <AnalysisChart uploadedAt={uploadedAt} /> */}
    </div>
  </div>
);

function mapStateToProps(state) {
  return {
    // analysis: upload.getAnalysisSummary(state),
    errored: file.getInvalidUploads(state),
    files: file.getFileSummary(state),
    uploadsInProgress: file.getGenomesInProgress(state),
  };
}

export default connect(mapStateToProps)(Progress);
