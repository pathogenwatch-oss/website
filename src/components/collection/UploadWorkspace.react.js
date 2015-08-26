var React = require('react');
var UploadStore = require('../../stores/UploadStore');
var UploadWorkspaceNavigationStore = require('../../stores/UploadWorkspaceNavigationStore');
var AssemblyWorkspace = require('./AssemblyWorkspace.react');

var containerStyle = {
  width: '100%',
  height: '100%',
  background: '-webkit-gradient(linear,left top,left bottom,color-stop(0,#f7f7f7),color-stop(1,#ebebeb))',
  overflow: 'scroll'
};

var UploadWorkspace = React.createClass({
  getInitialState: function () {
    return {
      fileAssemblyId: null
    }
  },

  componentDidMount: function () {
    UploadWorkspaceNavigationStore.addChangeListener(this.handleUploadWorkspaceNavigationStoreChange);
  },

  componentWillUnmount: function () {
    UploadWorkspaceNavigationStore.removeChangeListener(this.handleUploadWorkspaceNavigationStoreChange);
  },

  handleUploadWorkspaceNavigationStoreChange: function () {
    this.setState({
      fileAssemblyId: UploadWorkspaceNavigationStore.getFileAssemblyId()
    });
  },


  getAssemblyWorkspaceElement: function () {
    var fileAssemblyId = this.state.fileAssemblyId;
    var assembly = UploadStore.getAssembly(fileAssemblyId);
    var totalAssemblies = UploadStore.getAssembliesCount();

    // if (! assembly) {
    //   return null;
    // }

    return (
      <AssemblyWorkspace assembly={assembly} totalAssemblies={totalAssemblies}/>
    );
  },

  render: function () {
    return (
      <div style={containerStyle}>
        {this.getAssemblyWorkspaceElement()}
      </div>
    );
  }
});

module.exports = UploadWorkspace;
