var React = require('react');
var UploadStore = require('../../stores/UploadStore');
var UploadWorkspaceNavigationStore = require('../../stores/UploadWorkspaceNavigationStore');
var AssemblyWorkspace = require('./AssemblyWorkspace.react');
var UploadWorkspaceNavigation = require('./UploadWorkspaceNavigation.react');

var containerStyle = {
  width: '100%',
  height: '100%',
  background: '-webkit-gradient(linear,left top,left bottom,color-stop(0,#f7f7f7),color-stop(1,#ebebeb))',
  overflow: 'scroll'
};

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
    UploadStore.addChangeListener(this.handleUploadStoreChange);
  },

  componentWillUnmount: function () {
    UploadWorkspaceNavigationStore.removeChangeListener(this.handleUploadWorkspaceNavigationStoreChange);
    UploadStore.removeChangeListener(this.handleUploadStoreChange);
  },

  handleUploadWorkspaceNavigationStoreChange: function () {
    this.setState(this.getFileAssemblyId());
  },

  handleUploadStoreChange: function () {
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
      <div style={containerStyle}>
        <UploadWorkspaceNavigation />
        {this.getAssemblyWorkspaceElement()}
      </div>
    );
  }
});

module.exports = UploadWorkspace;
