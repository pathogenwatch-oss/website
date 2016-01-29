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

const RemainingTasksIndicator = ({ title, percentage }) => (
  <div className="wgsa-overview-upload-ready-card mdl-card mdl-cell mdl-cell--6-col">
    <div className="mdl-card__title mdl-card--expand">
      <CircularProgress radius="40" strokeWidth="8" percentage={Math.floor(percentage) || 0} />
      {/*{remaining === 0 ? (<span className="material-icons">check_circle</span>) : remaining}*/}
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
        <div className="wgsa-card-heading">Uploads</div>
        <div className="wgsa-card-content" style={{ textAlign: 'center' }}>
          <h5>{uploadedFiles}/{this.assemblyCount} uploaded</h5>
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
          <div className="wgsa-card-heading">Assembly Analyses</div>
          <div className="wgsa-card-content wgsa-assembly-analyses mdl-grid">
            <RemainingTasksIndicator title={'CORE'} percentage={assembly.core / this.assemblyCount * 100} />
            <RemainingTasksIndicator title={'FP'} percentage={assembly.fp / this.assemblyCount * 100 } />
            <RemainingTasksIndicator title={'MLST'} percentage={assembly.mlst / this.assemblyCount * 100 } />
            <RemainingTasksIndicator title={'PAARSNP'} percentage={assembly.paarsnp / this.assemblyCount * 100 } />
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
    const fileProgress = FileUploadingProgressStore.getFileProgress();
    this.setState({
      fileProgress: fileProgress / this.assemblyCount,
      uploadedFiles: Math.floor(fileProgress / 100),
      ...FileUploadingProgressStore.getResults(),
    });
  },

});

module.exports = UploadingAssembliesProgress;
