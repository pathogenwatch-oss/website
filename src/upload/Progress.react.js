import './styles.css';

import React from 'react';
import { connect } from 'react-redux';

import FileCard from './card/Card.react';

import * as upload from './selectors';

const Progress = ({ inProgress, errored, summary }) => (
  <div className="wgsa-content-margin wgsa-upload-progress">
    <div>
      <div className="wgsa-section-divider">
        <h2 className="wgsa-section-title">Files</h2>
        { inProgress.map(file => <FileCard item={file} />) }
        { summary.pending > 0 ?
          <p>
            +{summary.pending} file{summary.pending === 1 ? '' : 's'}.
          </p> :
          <p>
            {summary.completed} file{summary.completed === 1 ? '' : 's'} uploaded successfully.
          </p>}
      </div>
      { summary.errored > 0 &&
        <div className="wgsa-section-divider">
          <h2 className="wgsa-section-title">Errors ({ summary.errored })</h2>
          { errored.map(file => <FileCard item={file} />) }
        </div> }
    </div>
    <div className="wgsa-section-divider">
      <h2 className="wgsa-section-title">Analysis</h2>
    </div>
  </div>
);

function formatSunburstData(data) {
  return {
    name: 'sunburst',
    children: data.map(({ organismId, organismName, sequenceTypes }) =>
      ({
        name: `${organismName} (${organismId})`,
        children: sequenceTypes.map(({ st, total }) => ({ name: `ST: ${st}`, size: total })),
      })
    ),
  };
}

function mapStateToProps(state) {
  return {
    inProgress: upload.getFilesInProgress(state),
    errored: upload.getErroredUploads(state),
    summary: upload.getSummary(state),
  };
}

export default connect(mapStateToProps)(Progress);
