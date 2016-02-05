import React from 'react';

import FileUploadingProgressStore from '^/stores/FileUploadingProgressStore';

import { CGPS } from '^/defaults';

const inProgressOptions = {
  icon: 'warning',
  iconColour: CGPS.COLOURS.PURPLE,
  text: 'Please do not close the browser tab until all files have uploaded.',
};

const finishedOptions = {
  icon: 'check_circle',
  iconColour: CGPS.COLOURS.GREEN,
  text: 'Collection will continue to process if the browser tab is closed.',
};

export default React.createClass({

  propTypes: {
    collectionSize: React.PropTypes.number,
    isUploading: React.PropTypes.bool,
  },

  getInitialState() {
    return {
      progress: 0,
      uploadedFiles: 0,
    };
  },

  componentDidMount() {
    FileUploadingProgressStore.addChangeListener(this.handleFileUploadingProgressStoreChange);


    const { progressBar } = this.refs;
    progressBar.addEventListener('mdl-componentupgraded', (event) => {
      this.progressBar = event.target.MaterialProgress;
      if (!this.props.isUploading) {
        this.progressBar.setProgress(100);
      }
    });

    componentHandler.upgradeElement(progressBar);
  },

  componentDidUpdate() {
    if (this.props.isUploading) {
      this.progressBar.setProgress(this.state.progress);
    }
  },

  componentWillUnmount() {
    FileUploadingProgressStore.removeChangeListener(this.handleFileUploadingProgressStoreChange);
    FileUploadingProgressStore.clearStore();
  },

  render() {
    const { collectionSize, isUploading } = this.props;
    const { uploadedFiles } = this.state;
    const uploadFinished = !isUploading || this.state.progress >= 100;
    const { icon, iconColour, text } = uploadFinished ? finishedOptions : inProgressOptions;

    return (
      <div>
        <h5>{isUploading ? uploadedFiles : collectionSize}/{collectionSize} uploaded</h5>
        <div ref="progressBar" className="mdl-progress mdl-js-progress" style={{ width: '80%', margin: '16px auto' }}></div>
        <span className="material-icons" style={{ color: iconColour }}>{icon}</span>
        <p>{text}</p>
      </div>
    );
  },

  handleFileUploadingProgressStoreChange() {
    const fileProgress = FileUploadingProgressStore.getFileProgress();
    this.setState({
      progress: fileProgress / this.props.collectionSize,
      uploadedFiles: Math.floor(fileProgress / 100),
    });
  },

});
