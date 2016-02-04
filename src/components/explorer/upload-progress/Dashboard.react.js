import React from 'react';

import FileUploadProgressBar from './FileUploadProgressBar.react';

import CircularProgress from '^/components/CircularProgress.react';
import Spinner from '^/components/Spinner.react';

const ProgressIndicator = ({ title, percentage }) => (
  <div className="wgsa-overview-upload-ready-card mdl-card mdl-cell mdl-cell--3-col">
    <div className="mdl-card__title mdl-card--expand">
      <CircularProgress radius="40" strokeWidth="8" percentage={Math.floor(percentage) || 0} />
    </div>
    <span className="mdl-card__actions mdl-card--border">{title}</span>
  </div>
);


const UploadDashboard = React.createClass({

  propTypes: {
    isUploading: React.PropTypes.bool,
    results: React.PropTypes.object,
    errors: React.PropTypes.array,
    collectionSize: React.PropTypes.number,
  },

  getAssemblyTasks({ CORE, FP, MLST, PAARSNP }, collectionSize) {
    return {
      core: CORE / collectionSize * 100,
      fp: FP / collectionSize * 100,
      mlst: MLST / collectionSize * 100,
      paarsnp: PAARSNP / collectionSize * 100,
    };
  },

  render() {
    const { isUploading, collectionSize, results } = this.props;
    const { core, fp, mlst, paarsnp } = this.getAssemblyTasks(results, collectionSize);
    return (
      <div className="mdl-grid">
        <div className="wgsa-card mdl-cell mdl-cell--12-col mdl-shadow--2dp">
          <div className="wgsa-card-content" style={{ textAlign: 'center' }}>
            <FileUploadProgressBar collectionSize={collectionSize} isUploading={isUploading} />
            <div className="wgsa-assembly-analyses mdl-grid">
              <ProgressIndicator title={'CORE'} percentage={core} />
              <ProgressIndicator title={'MLST'} percentage={mlst} />
              <ProgressIndicator title={'PAARSNP'} percentage={paarsnp} />
              <div className="wgsa-overview-upload-ready-card mdl-card mdl-cell mdl-cell--3-col">
                <div className="mdl-card__title mdl-card--expand" style={{ fontSize: '16px' }}>
                  { (core >= 100 && fp >= 100) ?
                      <Spinner /> :
                      'PENDING'
                  }
                </div>
                <span className="mdl-card__actions mdl-card--border">TREES</span>
              </div>
            </div>
          </div>
        </div>
        <div className="wgsa-card mdl-cell mdl-cell--12-col mdl-shadow--2dp">
          <div className="wgsa-card-heading">Messages</div>
          <div className="wgsa-card-content">
            <p>Nothing to report :)</p>
          </div>
        </div>
      </div>
    );
  },

});

module.exports = UploadDashboard;
