import '../../css/progress-bar.css';

import React from 'react';

import FileUploadingProgressStore from '../../stores/FileUploadingProgressStore';

const FileUploadingProgress = React.createClass({

  componentDidMount: function () {
    FileUploadingProgressStore.addChangeListener(this.handleFileUploadingProgressStoreChange);

    const progressElement = React.findDOMNode(this.refs.progressBar);

    progressElement.addEventListener('mdl-componentupgraded', (event) => {
      this.progressBar = event.target.MaterialProgress;
    });

    componentHandler.upgradeElement(progressElement);
  },

  componentWillUnmount: function () {
    FileUploadingProgressStore.removeChangeListener(this.handleFileUploadingProgressStoreChange);
  },

  handleFileUploadingProgressStoreChange: function () {
    const percentage = FileUploadingProgressStore.getProgressPercentage();
    this.progressBar.setProgress(percentage);
  },

  render: function () {
    return (
      <div className="wgsa-fileupload-progressbar-container">
        <div ref="progressBar" className="wgsa-fileupload-progressbar mdl-progress mdl-js-progress"></div>
      </div>
    );
  },

});

module.exports = FileUploadingProgress;
