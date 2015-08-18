var React = require('react');
var UploadStore = require('../../../stores/UploadStore');
var UploadWorkspaceNavigationStore = require('../../../stores/UploadWorkspaceNavigationStore');
var UploadWorkspaceNavigationActionCreators = require('../../../actions/UploadWorkspaceNavigationActionCreators');
var AssemblyListOption = require('./AssemblyListOption.react');
import '../../../css/UploadReview.css';

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
    var listOptionElements = this.getListOptionElements();
    return (
      <select size={listOptionElements.length} className="assemblyListSelectInput form-control" value={this.state.selectedOption} onChange={this.handleSelectAssembly}>
        {listOptionElements}
      </select>
    );
  }
});

module.exports = AssemblyList;
