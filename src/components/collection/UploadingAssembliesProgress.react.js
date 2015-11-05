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

const ASSEMBLY_PERCENT_STYLE = {
  margin: 0,
  fontSize: '12px',
  lineHeight: '1',
};

const ASSEMBLY_PROGRESS_BAR_STYLE = {
  width: '80px',
  marginTop: '4px',
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

    componentHandler.upgradeElement(this.refs.table);
  },

  componentDidUpdate() {
    const { assemblyResults } = this.state;

    if (!assemblyResults) {
      return;
    }

    for (const assemblyName of Object.keys(FileUploadingStore.getAssemblyNameToAssemblyIdMap())) {
      const assemblyId = FileUploadingStore.getAssemblyNameToAssemblyIdMap()[assemblyName];
      const results = assemblyResults[assemblyId];
      if (results && results.progress && !results.UPLOAD_OK) {
        this.refs[`progress_${assemblyName}`]
          .MaterialProgress.setProgress(results.progress);
      }
    }
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

    return assemblyNames.map((assemblyName) => {
      let assemblyResult = {};
      let assemblyId;

      // This logic needs to be refactored:
      if (assemblyNameToAssemblyIdMap && assemblyResults) {
        assemblyId = assemblyNameToAssemblyIdMap[assemblyName];

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
                { resultName === 'UPLOAD_OK' && !assemblyResult[resultName] ?
                  <div>
                    <p style={ASSEMBLY_PERCENT_STYLE}>{`${assemblyResult.progress || 0}%`}</p>
                    <div style={ASSEMBLY_PROGRESS_BAR_STYLE} ref={`progress_${assemblyName}`} className="mdl-progress mdl-js-progress"></div>
                  </div>
                  :
                  <i style={ICON_STYLE} className="material-icons">
                  { assemblyResult[resultName] ?
                      'check_circle' :
                      'radio_button_unchecked' }
                  </i>
                }
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
