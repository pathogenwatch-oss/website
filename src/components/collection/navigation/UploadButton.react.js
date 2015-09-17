import '../../../css/sonar.css';

import React from 'react';
import UploadStore from '../../../stores/UploadStore';
import UploadActionCreators from '../../../actions/UploadActionCreators';
import FileUploadingProgressStore from '../../../stores/FileUploadingProgressStore';
import UploadWorkspaceNavigationActionCreators from '../../../actions/UploadWorkspaceNavigationActionCreators';


import DEFAULT from '../../../defaults.js';
import { validateMetadata } from '../../../utils/Metadata.js';

var uploadButtonStyle = {
  right: '30px',
  top: '30px',
  position: 'absolute',
  color: '#fff',
  fontSize: '18px',
  fontWeight: '400'
};

var iconStyle = {
  color: '#fff'
};

var UploadButton = React.createClass({

  getInitialState() {
    return {
      uploadProgressPercentage: 0
    };
  },

  componentDidMount() {
    FileUploadingProgressStore.addChangeListener(this.handleFileUploadingProgressStoreChange);
  },

  componentDidUnmount() {
    FileUploadingProgressStore.removeChangeListener(this.handleFileUploadingProgressStoreChange);
  },

  handleFileUploadingProgressStoreChange: function () {
    const percentage = FileUploadingProgressStore.getProgressPercentage();
    this.setState({
      uploadProgressPercentage: percentage,
    });
  },

  handleClick: function () {
    !this.props.isUploading && UploadActionCreators.getCollectionId();
    this.props.isUploading && UploadWorkspaceNavigationActionCreators.setViewPage('upload_progress');
  },

  render: function () {
    if (!this.props.activateButton) {
      uploadButtonStyle.background = DEFAULT.CGPS.COLOURS.GREY;
    }
    else {
      uploadButtonStyle.background = DEFAULT.CGPS.COLOURS.PURPLE;
    }

    return (
      <button
        style={uploadButtonStyle} className={`${this.props.activateButton && "wgsa-sonar-effect"} mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored mdl-shadow--6dp`}
        disabled={!this.props.activateButton}
        onClick={this.handleClick}>
        { this.props.isUploading &&
          <div>
            {this.state.uploadProgressPercentage}%
          </div>
          ||
          <i style={iconStyle} className="material-icons">cloud_upload</i>
        }
      </button>
    );
  }
});

module.exports = UploadButton;
