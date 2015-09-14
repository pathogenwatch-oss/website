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
      assemblyName: null
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
      assemblyName: UploadWorkspaceNavigationStore.getAssemblyName()
    });
  },


  getAssemblyWorkspaceElement: function () {
    var assemblyName = this.state.assemblyName;
    var assembly = UploadStore.getAssembly(assemblyName);
    var totalAssemblies = UploadStore.getAssembliesCount();

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
