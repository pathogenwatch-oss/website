import '../../css/progress-bar.css';

import React from 'react';

import FileUploadingProgressStore from '^/stores/FileUploadingProgressStore';

const FileUploadingProgress = React.createClass({

  componentDidMount() {
    FileUploadingProgressStore.addChangeListener(this.handleFileUploadingProgressStoreChange);

    const { progressBar } = this.refs;

    progressBar.addEventListener('mdl-componentupgraded', (event) => {
      this.progressBar = event.target.MaterialProgress;
    });

    componentHandler.upgradeElement(progressBar);
  },

  componentWillUnmount() {
    FileUploadingProgressStore.removeChangeListener(this.handleFileUploadingProgressStoreChange);
  },

  render() {
    return (
      <div className="wgsa-fileupload-progressbar-container">
        <div ref="progressBar" className="wgsa-fileupload-progressbar mdl-progress mdl-js-progress"></div>
      </div>
    );
  },

  handleFileUploadingProgressStoreChange() {
    const percentage = FileUploadingProgressStore.getProgressPercentage();
    this.progressBar.setProgress(percentage);
  },

});

module.exports = FileUploadingProgress;
