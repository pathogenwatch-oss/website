import React from 'react';

import FileUploadingProgressStore from '^/stores/FileUploadingProgressStore';
import UploadStore from '^/stores/UploadStore';

import { CGPS } from '^/defaults';

const ICON_WARNING = {
  color: CGPS.COLOURS.PURPLE,
};

const ICON_SUCCESS = {
  color: CGPS.COLOURS.GREEN,
};

const RemainingTasksIndicator = ({ title, remaining }) => (
  <div className="wgsa-overview-upload-ready-card mdl-card mdl-cell mdl-cell--6-col">
    <div className="mdl-card__title mdl-card--expand">
      {remaining === 0 ? (<span className="material-icons">check_circle</span>) : remaining}
    </div>
    <span className="mdl-card__actions mdl-card--border">{title}</span>
  </div>
);

const CompletedTaskIndicator = ({ title, completed }) => (
  <div>
    <span className="material-icons" style={completed ? ICON_SUCCESS : ICON_WARNING}>
      {completed ? 'check_circle' : 'radio_button_unchecked'}
    </span>
    <h5 className="wgsa-collection-analysis-status__title">{title}</h5>
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
        <div className="wgsa-card-heading">Assembly/Metadata Uploads</div>
        <div className="wgsa-card-content" style={{ textAlign: 'center' }}>
          <h5>{uploadedFiles}/{this.assemblyCount} files uploaded</h5>
          <div id="fileProgressBar" className="mdl-progress mdl-js-progress"
            style={{ width: '80%', margin: '16px auto' }}></div>
            <span className="material-icons" style={uploadFinished ? ICON_SUCCESS : ICON_WARNING}>
              {uploadFinished ? 'check_circle' : 'warning'}
            </span>
            <p>{uploadFinished ?
              'Collection will continue to process if the browser tab is closed.' :
              'Please do not close the browser tab until all files have uploaded.'
            }</p>
          </div>
        </div>
        <div className="wgsa-card mdl-cell mdl-cell--6-col mdl-shadow--2dp">
          <div className="wgsa-card-heading">Remaining Assembly Analyses</div>
          <div className="wgsa-card-content wgsa-assembly-analyses mdl-grid">
            <RemainingTasksIndicator title={'CORE'} remaining={this.assemblyCount - assembly.core} />
            <RemainingTasksIndicator title={'FP'} remaining={this.assemblyCount - assembly.fp} />
            <RemainingTasksIndicator title={'MLST'} remaining={this.assemblyCount - assembly.mlst} />
            <RemainingTasksIndicator title={'PAARSNP'} remaining={this.assemblyCount - assembly.paarsnp} />
          </div>
        </div>
        <div className="wgsa-card mdl-cell mdl-cell--6-col mdl-shadow--2dp">
          <div className="wgsa-card-heading">Collection Analyses</div>
          <div className="wgsa-card-content wgsa-collection-analyses">
            <CompletedTaskIndicator title={'MATRIX'} completed={collection.phylo_matrix} />
            <CompletedTaskIndicator title={'TREE'} completed={collection.core_mutant_tree} />
            <CompletedTaskIndicator title={'SUBTREES'} completed={collection.submatrix} />
          </div>
        </div>
      </div>
    );
  },

  handleFileUploadingProgressStoreChange() {
    console.warn('*', Math.floor(FileUploadingProgressStore.getFileProgress() / this.assemblyCount));
    this.setState({
      fileProgress: Math.floor(FileUploadingProgressStore.getFileProgress() / this.assemblyCount),
      uploadedFiles: FileUploadingProgressStore.getUploadedFiles(),
      ...FileUploadingProgressStore.getResults(),
    });
  },

});

module.exports = UploadingAssembliesProgress;
