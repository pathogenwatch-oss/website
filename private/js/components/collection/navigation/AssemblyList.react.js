var React = require('react');
var UploadStore = require('../../../stores/UploadStore');
var UploadWorkspaceNavigationStore = require('../../../stores/UploadWorkspaceNavigationStore');
var UploadWorkspaceNavigationActionCreators = require('../../../actions/UploadWorkspaceNavigationActionCreators');
var AssemblyListOption = require('./AssemblyListOption.react');

var AssemblyList = React.createClass({

  getInitialState: function () {
    return {
      selectedOption: null
    };
  },

  componentDidMount: function () {
    UploadWorkspaceNavigationStore.addChangeListener(this.handleUploadWorkspaceNavigationStoreChange);
  },

  componentWillUnmount: function () {
    UploadWorkspaceNavigationStore.removeChangeListener(this.handleUploadWorkspaceNavigationStoreChange);
  },

  handleUploadWorkspaceNavigationStoreChange: function () {
    this.setState({
      selectedOption: UploadWorkspaceNavigationStore.getFileAssemblyId()
    });
  },

  getListOptionElements: function () {
    var fileAssemblyIds = UploadStore.getFileAssemblyIds();

    return fileAssemblyIds.map(function iife(fileAssemblyId) {
      return (
        <AssemblyListOption fileAssemblyId={fileAssemblyId} key={fileAssemblyId} />
      );
    });
  },

  handleSelectAssembly: function (event) {
    var selectedFileAssemblyId = event.target.value;
    UploadWorkspaceNavigationActionCreators.navigateToAssembly(selectedFileAssemblyId);
  },

  render: function () {
    return (
      <select className="form-control" value={this.state.selectedOption} onChange={this.handleSelectAssembly}>
        {this.getListOptionElements()}
      </select>
    );
  }
});

module.exports = AssemblyList;
