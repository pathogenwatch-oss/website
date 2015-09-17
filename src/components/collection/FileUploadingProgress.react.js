import '../../css/progress-bar.css';

import React from 'react';

import FileUploadingProgressStore from '../../stores/FileUploadingProgressStore';

const containerStyle = {
  // margin: '16px 0 0 0',
};

const progressBarStyle = {
  // width: '100%',
  // margin: '0 10% 16px',
};

const FileUploadingProgress = React.createClass({

  getInitialState: function () {
    return {
      progressPercentage: 30,
    };
  },

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
    this.setState({
      progressPercentage: percentage,
    });
  },

  render: function () {
    return (
      <div style={containerStyle}>
        <div ref="progressBar" className="wgsa-fileupload-progressbar mdl-progress mdl-js-progress" style={progressBarStyle}></div>
      </div>
    );
  },

});

module.exports = FileUploadingProgress;
