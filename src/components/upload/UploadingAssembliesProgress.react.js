import React from 'react';

import FileUploadingProgressStore from '^/stores/FileUploadingProgressStore';
import FileUploadingStore from '^/stores/FileUploadingStore';
import UploadStore from '^/stores/UploadStore';

import { CGPS } from '^/defaults';

const ICON_STYLE = {
  fontSize: '16px',
  color: CGPS.COLOURS.PURPLE,
};

const CELL_STYLE = {
  textAlign: 'center',
  fontSize: '16px',
};

const UploadingAssembliesProgress = React.createClass({

  getInitialState() {
    return {
      results: {},
      fileProgress: 0,
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
    this.uploadProgress.MaterialProgress.setProgress(this.state.fileProgress);
  },

  componentWillUnmount() {
    FileUploadingProgressStore.removeChangeListener(this.handleFileUploadingProgressStoreChange);
  },

  render() {
    return (
      <div className="mdl-grid">
        <div className="wgsa-card mdl-cell mdl-cell--12-col mdl-shadow--2dp">
        <div className="wgsa-card-heading">Assembly/Metadata Uploads</div>
        <div className="wgsa-card-content" style={{ textAlign: 'center' }}>
          <p>44/100 files uploaded</p>
          <div id="fileProgressBar" className="mdl-progress mdl-js-progress"
            style={{ width: '80%', margin: '16px auto' }}></div>
          <span className="material-icons">warning</span>
          <p>
            Please do not close the browser tab until all files have been uploaded.
          </p>
        </div>
        </div>
        <div className="wgsa-card mdl-cell mdl-cell--6-col mdl-shadow--2dp">
          <div className="wgsa-card-heading">Remaining Assembly Analyses</div>
          <div className="wgsa-card-content wgsa-assembly-analyses mdl-grid">
            <div className="wgsa-overview-upload-ready-card mdl-card mdl-cell mdl-cell--6-col">
              <div className="mdl-card__title mdl-card--expand">93</div>
              <span className="mdl-card__actions mdl-card--border">CORE</span>
            </div>
            <div className="wgsa-overview-upload-ready-card mdl-card mdl-cell mdl-cell--6-col">
              <div className="mdl-card__title mdl-card--expand">93</div>
              <span className="mdl-card__actions mdl-card--border">FP</span>
            </div>
            <div className="wgsa-overview-upload-ready-card mdl-card mdl-cell mdl-cell--6-col">
              <div className="mdl-card__title mdl-card--expand">93</div>
              <span className="mdl-card__actions mdl-card--border">MLST</span>
            </div>
            <div className="wgsa-overview-upload-ready-card mdl-card mdl-cell mdl-cell--6-col">
              <div className="mdl-card__title mdl-card--expand">93</div>
              <span className="mdl-card__actions mdl-card--border">PAARSNP</span>
            </div>
          </div>
        </div>
        <div className="wgsa-card mdl-cell mdl-cell--6-col mdl-shadow--2dp">
          <div className="wgsa-card-heading">Collection Analyses</div>
          <div className="wgsa-card-content wgsa-collection-analyses">
            <div>
              <span className="material-icons">radio_button_unchecked</span>
              <h5 className="wgsa-collection-analysis-status__title">MATRIX</h5>
            </div>
            <div>
              <span className="material-icons">radio_button_unchecked</span>
              <h5 className="wgsa-collection-analysis-status__title">TREE</h5>
            </div>
            <div>
              <span className="material-icons">radio_button_unchecked</span>
              <h5 className="wgsa-collection-analysis-status__title">SUBTREE</h5>
            </div>
          </div>
        </div>
      </div>
    );
  },

  handleFileUploadingProgressStoreChange() {
    this.setState({
      results: FileUploadingProgressStore.getResults(),
    });
  },

});

module.exports = UploadingAssembliesProgress;
