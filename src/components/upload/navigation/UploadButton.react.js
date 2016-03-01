import '../../../css/sonar.css';

import React from 'react';

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
    onClick: React.PropTypes.func,
  },

  render() {
    return (
      <button
        style={uploadButtonStyle} className={`${this.props.active && 'wgsa-sonar-effect'} wgsa-upload-review-button mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored mdl-shadow--6dp`}
        disabled={!this.props.active}
        onClick={this.props.onClick}>
          <i style={iconStyle} className="material-icons">cloud_upload</i>
      </button>
    );
  },

});

module.exports = UploadButton;
