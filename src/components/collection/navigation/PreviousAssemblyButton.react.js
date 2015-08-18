var React = require('react');
var UploadStore = require('../../../stores/UploadStore');
var UploadWorkspaceNavigationStore = require('../../../stores/UploadWorkspaceNavigationStore');
var UploadWorkspaceNavigationActionCreators = require('../../../actions/UploadWorkspaceNavigationActionCreators');

var Component = React.createClass({
  isButtonDisabled: function () {
    var currentFileAssemblyId = UploadWorkspaceNavigationStore.getFileAssemblyId();
    var fileAssemblyIds = UploadStore.getFileAssemblyIds();
    var indexOfCurrentFileAssemblyId = fileAssemblyIds.indexOf(currentFileAssemblyId);

    return (indexOfCurrentFileAssemblyId === 0);
  },

  handleClick: function () {
    UploadWorkspaceNavigationActionCreators.navigateToPreviousAssembly();
  },

  render: function () {
    return (
      <button type="button" className="mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab"
        disabled={this.isButtonDisabled()} onClick={this.handleClick}>
        <i className="material-icons">navigate_before</i>
      </button>
    );
  }
});

module.exports = Component;
