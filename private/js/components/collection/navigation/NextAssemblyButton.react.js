var React = require('react');
var UploadStore = require('../../../stores/UploadStore');
var UploadWorkspaceNavigationStore = require('../../../stores/UploadWorkspaceNavigationStore');
var UploadWorkspaceNavigationActionCreators = require('../../../actions/UploadWorkspaceNavigationActionCreators');

var Component = React.createClass({
  isButtonDisabled: function () {
    var currentFileAssemblyId = UploadWorkspaceNavigationStore.getFileAssemblyId();
    var fileAssemblyIds = UploadStore.getFileAssemblyIds();
    var indexOfCurrentFileAssemblyId = fileAssemblyIds.indexOf(currentFileAssemblyId);
    var indexOfNextFileAssemblyId = indexOfCurrentFileAssemblyId + 1;

    return (typeof fileAssemblyIds[indexOfNextFileAssemblyId] === 'undefined');
  },

  handleClick: function () {
    UploadWorkspaceNavigationActionCreators.navigateToNextAssembly();
  },

  render: function () {
    return (
      <button type="button" className="btn btn-default" disabled={this.isButtonDisabled()} onClick={this.handleClick}>
        <i className="fa fa-chevron-right"></i>
      </button>
    );
  }
});

module.exports = Component;
