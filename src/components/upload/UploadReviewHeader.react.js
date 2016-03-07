import React from 'react';

import UploadButton from './navigation/UploadButton.react';

const subtitleStyle = {
  marginRight: '80px',
  textTransform: 'uppercase',
  color: '#666',
  fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
  fontSize: '16px',
  fontWeight: '500',
};

export default React.createClass({

  displayName: 'UploadReviewHeader',

  render() {
    return (
      <span className="mdl-layout-spacer" style={{ textAlign: 'right' }}>
        <span key="subtitle" style={subtitleStyle} className="mdl-layout-title">
          {this.props.subtitle}
        </span>
        <UploadButton key="upload-button"
          active={this.props.activateUploadButton}
          onClick={this.props.handleUploadButtonClick}
        />
      </span>
    );
  },

});
