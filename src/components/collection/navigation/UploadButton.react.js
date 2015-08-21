var React = require('react');
var UploadStore = require('../../../stores/UploadStore');
var UploadActionCreators = require('../../../actions/UploadActionCreators');
var DEFAULT = require('../../../defaults.js');

var uploadButtonStyle = {
  right: '10px',
  top: '30px',
  position: 'absolute',
  'background': DEFAULT.CGPS.COLOURS.PURPLE
};

var UploadButton = React.createClass({

  isAllMetadataProvided: function () {
    var assemblies = UploadStore.getAssemblies();
    var fileAssemblyIds = UploadStore.getFileAssemblyIds();
    var metadata;

    return fileAssemblyIds.every(function iife(fileAssemblyId) {
      metadata = assemblies[fileAssemblyId].metadata;

      if (! metadata.date.year || ! metadata.date.month || ! metadata.date.day) {
        return false;
      }

      if (! metadata.source) {
        return false;
      }

      return true;
    });
  },

  isButtonDisabled: function () {
    return ! this.isAllMetadataProvided();
  },

  handleClick: function () {
    UploadActionCreators.getCollectionId();
  },

  render: function () {
    return (
      <button
        style={uploadButtonStyle} className="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored"
        disabled={this.isButtonDisabled()}
        onClick={this.handleClick}>
        <i className="material-icons">cloud_upload</i>
      </button>
    );
  }
});

module.exports = UploadButton;
