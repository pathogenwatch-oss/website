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
  width: 'auto',
  border: 'none',
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
  'METADATA_OK',
  'PAARSNP',
  'MLST',
  'CORE',
  'FP',
];

const UploadingAssembliesProgress = React.createClass({

  getInitialState: function () {
    return {
      assemblyResults: FileUploadingProgressStore.getReceivedAssemblyResults().assemblies,
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
      assemblyResults: FileUploadingProgressStore.getReceivedAssemblyResults().assemblies,
    });
  },

  getAssemblyResultElements: function () {
    const assemblyNameToAssemblyIdMap = FileUploadingStore.getAssemblyNameToAssemblyIdMap();
    const assemblyNames = UploadStore.getAssemblyNames();
    const assemblyResults = this.state.assemblyResults;

    return assemblyNames.map(function createAssemblyResultElement(assemblyName) {
      let assemblyResult = {};

      // This logic needs to be refactored:
      if (assemblyNameToAssemblyIdMap && assemblyResults) {
        const assemblyId = assemblyNameToAssemblyIdMap[assemblyName];

        if (assemblyResults[assemblyId]) {
          assemblyResult = assemblyResults[assemblyId];
        }
      }

      return (
        <tr key={assemblyName}>
          <td style={FILE_ASSEMBLY_ID_STYLE} className="mdl-data-table__cell--non-numeric">{assemblyName}</td>
          { resultColumns.map((resultName) => {
            return (
              <td style={CELL_STYLE} key={`${assemblyName}-${resultName}`}>
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
      <table ref="table" className="mdl-data-table mdl-shadow--4dp" style={TABLE_STYLE}>
        <thead>
          <tr>
            <td style={CELL_STYLE}></td>
            <td style={HEADER_STYLE}>UPLOAD</td>
            <td style={HEADER_STYLE}>METADATA</td>
            <td style={HEADER_STYLE}>PAARSNP</td>
            <td style={HEADER_STYLE}>MLST</td>
            <td style={HEADER_STYLE}>KERNEL</td>
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
