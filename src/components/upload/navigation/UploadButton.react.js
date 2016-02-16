import '../../../css/sonar.css';

import React from 'react';
import UploadActionCreators from '^/actions/UploadActionCreators';

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

  propTypes: {
    active: React.PropTypes.bool,
    children: React.PropTypes.any,
  },

  render() {
    return (
      <button
        style={uploadButtonStyle} className={`${this.props.active && 'wgsa-sonar-effect'} wgsa-upload-review-button mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored mdl-shadow--6dp`}
        disabled={!this.props.active}
        onClick={this.handleClick}>
          <i style={iconStyle} className="material-icons">cloud_upload</i>
      </button>
    );
  },

  handleClick() {
    UploadActionCreators.getCollectionId();
  },

});

module.exports = UploadButton;
