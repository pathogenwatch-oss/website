import React from 'react';

import UploadButton from './navigation/UploadButton.react';

export default React.createClass({

  displayName: 'UploadReviewHeader',

  render() {
    return (
      <span className="mdl-layout-spacer" style={{ textAlign: 'right' }}>
        <span className="wgsa-upload-subtitle mdl-layout-title">
          {this.props.subtitle}
        </span>
        <UploadButton
          active={this.props.activateUploadButton}
          onClick={this.props.handleUploadButtonClick}
        />
      </span>
    );
  },

});
