import './styles.css';

import React from 'react';
import { connect } from 'react-redux';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import FileCard from '../card/Card.react';
import AnalysisChart from './AnalysisChart.react';

import * as upload from './selectors';

const Analysis = ({ data }) => (
  <ul>
    { data.map(({ key, label, total, mlstTotal }) =>
      <li key={key}>
        <strong>{label}</strong>: {total}
        <ul>
          { mlstTotal > 0 &&
            <li>
              <strong>MLST</strong>: {mlstTotal}/{total}
            </li> }
        </ul>
      </li>
    ) }
  </ul>
);

const Progress = ({ inProgress, errored, summary, analysis }) => (
  <div className="wgsa-content-margin wgsa-upload-progress">
    <div>
      { summary.pending > 0 &&
        <div className="wgsa-section-divider">
          <h2 className="wgsa-section-title">Files</h2>
          <ReactCSSTransitionGroup
            className="wgsa-upload-card-list"
            transitionName="wgsa-upload-card"
            transitionEnterTimeout={540}
            transitionLeaveTimeout={540}
          >
            { inProgress.map(file => <FileCard key={file.id} item={file} />) }
          </ReactCSSTransitionGroup>
          <p>
            +{summary.pending} file{summary.pending === 1 ? '' : 's'}.
          </p>
        </div> }
      { (analysis.length && analysis[0].key !== 'pending') &&
        <div className="wgsa-section-divider">
          <h2 className="wgsa-section-title">Organisms</h2>
          <Analysis data={analysis} />
        </div> }
      { summary.errored > 0 &&
        <div className="wgsa-section-divider">
          <h2 className="wgsa-section-title">Errors ({ summary.errored })</h2>
          { errored.map(file => <FileCard key={file.id} item={file} />) }
        </div> }
    </div>
    <div className="wgsa-section-divider">
      <h2 className="wgsa-section-title">Analysis</h2>
      <AnalysisChart />
    </div>
  </div>
);

function mapStateToProps(state) {
  return {
    inProgress: upload.getFilesInProgress(state),
    errored: upload.getErroredUploads(state),
    summary: upload.getSummary(state),
    analysis: upload.getAnalysisSummary(state),
  };
}

export default connect(mapStateToProps)(Progress);
