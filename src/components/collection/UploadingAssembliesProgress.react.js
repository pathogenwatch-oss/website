import React from 'react';

import UploadStore from '../../stores/UploadStore';
import FileUploadingProgressStore from '../../stores/FileUploadingProgressStore';
import FileUploadingStore from '../../stores/FileUploadingStore';

import { CGPS } from '../../defaults';

const ICON_STYLE = {
  fontSize: '16px',
  color: CGPS.COLOURS.PURPLE,
};

const TABLE_STYLE = {
  marginTop: '16px',
  width: '100%',
};

const HEADER_STYLE = {
  textAlign: 'center',
};

const CELL_STYLE = {
  textAlign: 'center',
  fontSize: '16px',
};

const FILE_ASSEMBLY_ID_STYLE = {
  textAlign: 'center',
  fontWeight: '600',
};

const resultColumns = [
  'UPLOAD_OK',
  'SCCMEC',
  'PAARSNP',
  'MLST',
  'CORE',
  'FP',
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
            return (
              <td style={CELL_STYLE} key={`${fileAssemblyId}-${resultName}`}>
                <i style={ICON_STYLE} className="material-icons">
                { assemblyResult[resultName] ?
                    'check_circle' :
                    'radio_button_unchecked' }
                </i>
              </td>
            );
          }) }
        </tr>
      );
    });
  },

  render: function () {
    return (
      <table ref="table" className="mdl-data-table mdl-shadow--2dp" style={TABLE_STYLE}>
        <thead>
          <tr>
            <td style={CELL_STYLE}></td>
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
