import '../../../css/sonar.css';

import React from 'react';
import UploadActionCreators from '^/actions/UploadActionCreators';
import UploadWorkspaceNavigationActionCreators from '^/actions/UploadWorkspaceNavigationActionCreators';


const uploadButtonStyle = {
  right: '30px',
  top: '24px',
  position: 'absolute',
  zIndex: 1,
  color: '#fff',
  fontSize: '18px',
  fontWeight: '400',
};

const iconStyle = {
  color: '#fff',
};

const UploadButton = React.createClass({

  handleClick: function () {
    !this.props.isUploading && UploadActionCreators.getCollectionId();
    this.props.isUploading && UploadWorkspaceNavigationActionCreators.setViewPage('upload_progress');
  },

  render: function () {
    return (
      <button
        style={uploadButtonStyle} className={`${this.props.activateButton && 'wgsa-sonar-effect'} wgsa-upload-review-button mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored mdl-shadow--6dp`}
        disabled={!this.props.activateButton}
        onClick={this.handleClick}>
        { this.props.isUploading &&
          <div>
            {this.props.uploadProgressPercentage}%
          </div>
          ||
          <i style={iconStyle} className="material-icons">cloud_upload</i>
        }
      </button>
    );
  }
});

module.exports = UploadButton;
