import React from 'react';

import CircularProgress from '^/components/CircularProgress.react';

import FileUploadingProgressStore from '^/stores/FileUploadingProgressStore';
import UploadStore from '^/stores/UploadStore';

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


const UploadingAssembliesProgress = React.createClass({

  getInitialState() {
    return {
      fileProgress: 0,
      uploadedFiles: 0,
      assembly: {
        core: 0,
        fp: 0,
        mlst: 0,
        paarsnp: 0,
      },
      collection: {
        phylo_matrix: false,
        core_mutant_tree: false,
        submatrix: false,
      },
    };
  },

  componentWillMount() {
    this.assemblyCount = UploadStore.getAssembliesCount();
  },

  componentDidMount() {
    FileUploadingProgressStore.addChangeListener(this.handleFileUploadingProgressStoreChange);
    this.uploadProgress = document.querySelector('#fileProgressBar');
    componentHandler.upgradeElement(this.uploadProgress);
  },

  componentDidUpdate() {
    console.log(this.state.fileProgress);
    this.uploadProgress.MaterialProgress.setProgress(this.state.fileProgress);
  },

  componentWillUnmount() {
    FileUploadingProgressStore.removeChangeListener(this.handleFileUploadingProgressStoreChange);
  },

  render() {
    const { uploadedFiles, assembly, collection } = this.state;
    const uploadFinished = uploadedFiles === this.assemblyCount;
    return (
      <div className="mdl-grid">
        <div className="wgsa-card mdl-cell mdl-cell--12-col mdl-shadow--2dp">
          <div className="wgsa-card-content" style={{ textAlign: 'center' }}>
            { this.props.uploading ?
              <div>
                <h5>{uploadedFiles}/{this.assemblyCount} uploaded</h5>
                <div id="fileProgressBar" className="mdl-progress mdl-js-progress" style={{ width: '80%', margin: '16px auto' }}></div>
                <span className="material-icons" style={uploadFinished ? ICON_SUCCESS : ICON_WARNING}>
                  {uploadFinished ? 'check_circle' : 'warning'}
                </span>
                <p>{uploadFinished ?
                  'Collection will continue to process if the browser tab is closed.' :
                  'Please do not close the browser tab until all files have uploaded.'
                }</p>
              </div> :
              <h5>{this.assemblyCount} assemblies uploaded</h5>
            }
            <div className="wgsa-assembly-analyses mdl-grid">
              <ProgressIndicator title={'CORE'} percentage={assembly.core / this.assemblyCount * 100} />
              <ProgressIndicator title={'MLST'} percentage={assembly.mlst / this.assemblyCount * 100 } />
              <ProgressIndicator title={'PAARSNP'} percentage={assembly.paarsnp / this.assemblyCount * 100 } />
              <div className="wgsa-overview-upload-ready-card mdl-card mdl-cell mdl-cell--3-col">
                <div className="mdl-card__title mdl-card--expand" style={{ fontSize: '16px' }}>
                  PENDING
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

module.exports = UploadingAssembliesProgress;
