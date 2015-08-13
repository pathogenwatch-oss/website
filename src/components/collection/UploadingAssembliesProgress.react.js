var React = require('react');

var UploadStore = require('../../stores/UploadStore');
var FileUploadingProgressStore = require('../../stores/FileUploadingProgressStore');
var FileUploadingStore = require('../../stores/FileUploadingStore');

var ICON_STYLE = {
  fontSize: '16px'
};

var TABLE_STYLE = {
  marginTop: '20px'
};

var HEADER_STYLE = {
  fontSize: '16px',
  textShadow: '1px 1px #fff'
};

var CELL_STYLE = {
  fontSize: '16px',
  textShadow: '1px 1px #fff'
};

var FILE_ASSEMBLY_ID_STYLE = {
  fontWeight: '600',
  textShadow: '1px 1px #fff'
};

var UploadingAssembliesProgress = React.createClass({

  getInitialState: function () {
    return {
      assemblyResults: FileUploadingProgressStore.getReceivedAssemblyResults().assemblies
    };
  },

  componentDidMount: function () {
    FileUploadingProgressStore.addChangeListener(this.handleFileUploadingProgressStoreChange);
  },

  componentWillUnmount: function () {
    FileUploadingProgressStore.removeChangeListener(this.handleFileUploadingProgressStoreChange);
  },

  handleFileUploadingProgressStoreChange: function () {
    this.setState({
      assemblyResults: FileUploadingProgressStore.getReceivedAssemblyResults().assemblies
    });
  },

  getAssemblyResultElements: function () {
    var fileAssemblyIdToAssemblyIdMap = FileUploadingStore.getFileAssemblyIdToAssemblyIdMap();
    var fileAssemblyIds = UploadStore.getFileAssemblyIds();
    var assemblyResults = this.state.assemblyResults; //FileUploadingProgressStore.getReceivedAssemblyResults().assemblies;
    var assemblyResult;
    var assemblyId;

    return fileAssemblyIds.map(function createAssemblyResultElement(fileAssemblyId) {

      assemblyResult = {};

      // This logic needs to be refactored:
      if (fileAssemblyIdToAssemblyIdMap && assemblyResults) {
        assemblyId = fileAssemblyIdToAssemblyIdMap[fileAssemblyId];

        if (assemblyResults[assemblyId]) {
          assemblyResult = assemblyResults[assemblyId];
        }
      }

      return (
        <tr key={fileAssemblyId}>
          <td style={FILE_ASSEMBLY_ID_STYLE}>{fileAssemblyId}</td>
          <td style={CELL_STYLE}>{assemblyResult['UPLOAD_OK'] ? <i className="fa fa-check-square-o" style={ICON_STYLE}></i> : <i className="fa fa-square-o" style={ICON_STYLE}></i>}</td>
          <td style={CELL_STYLE}>{assemblyResult['SCCMEC'] ? <i className="fa fa-check-square-o" style={ICON_STYLE}></i> : <i className="fa fa-square-o" style={ICON_STYLE}></i>}</td>
          <td style={CELL_STYLE}>{assemblyResult['PAARSNP_RESULT'] ? <i className="fa fa-check-square-o" style={ICON_STYLE}></i> : <i className="fa fa-square-o" style={ICON_STYLE}></i>}</td>
          <td style={CELL_STYLE}>{assemblyResult['MLST_RESULT'] ? <i className="fa fa-check-square-o" style={ICON_STYLE}></i> : <i className="fa fa-square-o" style={ICON_STYLE}></i>}</td>
          <td style={CELL_STYLE}>{assemblyResult['CORE_RESULT'] ? <i className="fa fa-check-square-o" style={ICON_STYLE}></i> : <i className="fa fa-square-o" style={ICON_STYLE}></i>}</td>
          <td style={CELL_STYLE}>{assemblyResult['FP_COMP'] ? <i className="fa fa-check-square-o" style={ICON_STYLE}></i> : <i className="fa fa-square-o" style={ICON_STYLE}></i>}</td>
        </tr>
      );
    });
  },

  render: function () {
    return (
      <table className="table table-hover" style={TABLE_STYLE}>
        <thead>
          <tr>
            <td style={HEADER_STYLE}>ASSEMBLY</td>
            <td style={HEADER_STYLE}>UPLOAD</td>
            <td style={HEADER_STYLE}>SCCMEC</td>
            <td style={HEADER_STYLE}>PAARSNP</td>
            <td style={HEADER_STYLE}>MLST</td>
            <td style={HEADER_STYLE}>CORE</td>
            <td style={HEADER_STYLE}>FP</td>
          </tr>
        </thead>
        <tbody>
          {this.getAssemblyResultElements()}
        </tbody>
      </table>
    );
  }
});

module.exports = UploadingAssembliesProgress;
