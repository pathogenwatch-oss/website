var React = require('react');
var UploadStore = require('../../../stores/UploadStore');
var UploadActionCreators = require('../../../actions/UploadActionCreators');

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
    //UploadWorkspaceNavigationActionCreators.navigateToNextAssembly();
  },

  render: function () {
    return (
      <button
        className="btn btn-success"
        type="button"
        disabled={this.isButtonDisabled()}
        onClick={this.handleClick}>Upload</button>
    );
  }
});

module.exports = UploadButton;
