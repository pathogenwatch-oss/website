var React = require('react');
var UploadStore = require('../../stores/UploadStore');
var UploadWorkspaceNavigationStore = require('../../stores/UploadWorkspaceNavigationStore');
var AssemblyWorkspace = require('./AssemblyWorkspace.react');
var UploadWorkspaceNavigation = require('./UploadWorkspaceNavigation.react');

var UploadWorkspace = React.createClass({
  getInitialState: function () {
    return this.getFileAssemblyId();
  },

  getFileAssemblyId: function () {
    return {
      fileAssemblyId: UploadWorkspaceNavigationStore.getFileAssemblyId()
    };
  },

  componentDidMount: function () {
    UploadWorkspaceNavigationStore.addChangeListener(this.handleUploadWorkspaceNavigationStoreChange);
  },

  componentWillUnmount: function () {
    UploadWorkspaceNavigationStore.removeChangeListener(this.handleUploadWorkspaceNavigationStoreChange);
  },

  handleUploadWorkspaceNavigationStoreChange: function () {
    this.setState(this.getFileAssemblyId());
  },

  getAssemblyWorkspaceElement: function () {
    var fileAssemblyId = this.state.fileAssemblyId;
    var assembly = UploadStore.getAssembly(fileAssemblyId);

    if (! assembly) {
      return null;
    }

    return (
      <AssemblyWorkspace assembly={assembly} />
    );
  },

  render: function () {
    return (
      <div>
        <div className="container-fliud">
          <div className="row">
            <div className="col-sm-12">
              {this.getAssemblyWorkspaceElement()}
            </div>
          </div>
        </div>

        <UploadWorkspaceNavigation />
      </div>
    );
  }
});

module.exports = UploadWorkspace;
