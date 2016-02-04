import React from 'react';

import CircularProgress from '^/components/CircularProgress.react';
import Spinner from '^/components/Spinner.react';

import FileUploadingProgressStore from '^/stores/FileUploadingProgressStore';

import { CGPS } from '^/defaults';

const ICON_WARNING = {
  color: CGPS.COLOURS.PURPLE,
};

const ICON_SUCCESS = {
  color: CGPS.COLOURS.GREEN,
};

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

  componentDidMount() {
    FileUploadingProgressStore.addChangeListener(this.handleFileUploadingProgressStoreChange);
    this.uploadProgress = document.querySelector('#fileProgressBar');
    // componentHandler.upgradeElement(this.uploadProgress);
  },

  componentDidUpdate() {
    this.uploadProgress.MaterialProgress.setProgress(this.state.fileProgress);
  },

  componentWillUnmount() {
    FileUploadingProgressStore.removeChangeListener(this.handleFileUploadingProgressStoreChange);
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
            { isUploading ?
              <div>
                <h5>{uploadedFiles}/{collectionSize} uploaded</h5>
                <div id="fileProgressBar" className="mdl-progress mdl-js-progress" style={{ width: '80%', margin: '16px auto' }}></div>
                <span className="material-icons" style={uploadFinished ? ICON_SUCCESS : ICON_WARNING}>
                  {uploadFinished ? 'check_circle' : 'warning'}
                </span>
                <p>{uploadFinished ?
                  'Collection will continue to process if the browser tab is closed.' :
                  'Please do not close the browser tab until all files have uploaded.'
                }</p>
              </div> :
              <h5>{collectionSize} assemblies uploaded</h5>
            }
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

  handleFileUploadingProgressStoreChange() {
    const fileProgress = FileUploadingProgressStore.getFileProgress();
    this.setState({
      fileProgress: fileProgress / this.assemblyCount,
      uploadedFiles: Math.floor(fileProgress / 100),
      ...FileUploadingProgressStore.getResults(),
    });
  },

});

module.exports = UploadDashboard;
