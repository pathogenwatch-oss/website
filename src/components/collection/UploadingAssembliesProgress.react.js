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

const UploadingAssembliesProgress = React.createClass({

  getInitialState() {
    return {
      assemblyResults: FileUploadingProgressStore.getReceivedAssemblyResults().assemblies,
    };
  },

  componentWillMount() {
    this.resultColumns = FileUploadingStore.getAssemblyProcessingResults();
  },

  componentDidMount() {
    FileUploadingProgressStore.addChangeListener(this.handleFileUploadingProgressStoreChange);

    componentHandler.upgradeElement(React.findDOMNode(this.refs.table));
  },

  componentWillUnmount() {
    FileUploadingProgressStore.removeChangeListener(this.handleFileUploadingProgressStoreChange);
  },

  handleFileUploadingProgressStoreChange() {
    this.setState({
      assemblyResults: FileUploadingProgressStore.getReceivedAssemblyResults().assemblies,
    });
  },

  getAssemblyResultElements() {
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
          { this.resultColumns.map((resultName) => {
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

  render() {
    return (
      <table ref="table" className="mdl-data-table mdl-shadow--4dp" style={TABLE_STYLE}>
        <thead>
          <tr>
            <td style={CELL_STYLE}></td>
            <td style={HEADER_STYLE}>UPLOAD</td>
            <td style={HEADER_STYLE}>METADATA</td>
            <td style={HEADER_STYLE}>KERNEL</td>
            <td style={HEADER_STYLE}>FP</td> {
              this.resultColumns.indexOf('MLST') !== -1 ?
                <td style={HEADER_STYLE}>MLST</td> : null
            } {
              this.resultColumns.indexOf('PAARSNP') !== -1 ?
                <td style={HEADER_STYLE}>PAARSNP</td> : null
            }
          </tr>
        </thead>
        <tbody>
          {this.getAssemblyResultElements()}
        </tbody>
      </table>
    );
  },

});

module.exports = UploadingAssembliesProgress;
