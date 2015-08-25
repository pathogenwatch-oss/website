import React from 'react';

import UploadStore from '../../stores/UploadStore';
import FileUploadingProgressStore from '../../stores/FileUploadingProgressStore';
import FileUploadingStore from '../../stores/FileUploadingStore';

const ICON_STYLE = {
  fontSize: '16px',
};

const TABLE_STYLE = {
  marginTop: '20px',
  width: '100%',
};

const HEADER_STYLE = {
  fontSize: '16px',
  textShadow: '1px 1px #fff',
};

const CELL_STYLE = {
  fontSize: '16px',
  textShadow: '1px 1px #fff',
};

const FILE_ASSEMBLY_ID_STYLE = {
  fontWeight: '600',
  textShadow: '1px 1px #fff',
};

const resultColumns = [
  'UPLOAD_OK',
  'SCCMEC',
  'PAARSNP_RESULT',
  'MLST_RESULT',
  'CORE_RESULT',
  'FP_COMP',
];

const UploadingAssembliesProgress = React.createClass({

  getInitialState: function () {
    return {
      assemblyResults: FileUploadingProgressStore.getReceivedAssemblyResults().assemblies
    };
  },

  componentDidMount: function () {
    FileUploadingProgressStore.addChangeListener(this.handleFileUploadingProgressStoreChange);

    componentHandler.upgradeElement(React.findDOMNode(this.refs.table));
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
    const fileAssemblyIdToAssemblyIdMap = FileUploadingStore.getFileAssemblyIdToAssemblyIdMap();
    const fileAssemblyIds = UploadStore.getFileAssemblyIds();
    const assemblyResults = this.state.assemblyResults;

    return fileAssemblyIds.map(function createAssemblyResultElement(fileAssemblyId) {
      let assemblyResult = {};

      // This logic needs to be refactored:
      if (fileAssemblyIdToAssemblyIdMap && assemblyResults) {
        const assemblyId = fileAssemblyIdToAssemblyIdMap[fileAssemblyId];

        if (assemblyResults[assemblyId]) {
          assemblyResult = assemblyResults[assemblyId];
        }
      }

      return (
        <tr key={fileAssemblyId}>
          <td style={FILE_ASSEMBLY_ID_STYLE} className="mdl-data-table__cell--non-numeric">{fileAssemblyId}</td>
          { resultColumns.map((resultName) => {
            <td style={CELL_STYLE} className="mdl-data-table__cell--non-numeric">
              <i style={ICON_STYLE} className="material-icons">
              { assemblyResult[resultName] ?
                  'radio_button_unchecked' :
                  'check-circle' }
              </i>
            </td>;
          }) }
        </tr>
      );
    });
  },

  render: function () {
    return (
      <table ref="table" className="mdl-data-table mdl-js-data-table" style={TABLE_STYLE}>
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
