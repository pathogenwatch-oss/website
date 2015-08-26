import React from 'react';
import UploadStore from '../../../stores/UploadStore';
import UploadActionCreators from '../../../actions/UploadActionCreators';
import DEFAULT from '../../../defaults.js';
import { validateMetadata } from '../../../utils/Metadata.js';

var uploadButtonStyle = {
  right: '10px',
  top: '30px',
  position: 'absolute',
  'background': DEFAULT.CGPS.COLOURS.PURPLE,
  'color': '#fff'
};

var active = 'false';

var UploadButton = React.createClass({

  handleClick: function () {
    UploadActionCreators.getCollectionId();
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
        style={uploadButtonStyle} className="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored mdl-shadow--4dp"
        disabled={!this.active}
        onClick={this.handleClick}>
        <i className="material-icons">cloud_upload</i>
      </button>
    );
  }
});

module.exports = UploadButton;
