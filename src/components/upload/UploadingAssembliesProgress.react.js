import React from 'react';

import UploadStore from '^/stores/UploadStore';
import FileUploadingProgressStore from '^/stores/FileUploadingProgressStore';
import FileUploadingStore from '^/stores/FileUploadingStore';

import { CGPS } from '^/defaults';

const ICON_STYLE = {
  fontSize: '16px',
  color: CGPS.COLOURS.PURPLE,
};

const TABLE_STYLE = {
  width: '100%',
  border: 'none',
  margin: 'auto',
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
      receivedResults: FileUploadingProgressStore.getReceivedResults(),
    };
  },

  componentWillMount() {
    this.assemblyResultColumns = FileUploadingStore.getAssemblyProcessingResults();
    this.collectionResultColumns = FileUploadingStore.getCollectionProcessingResults();
  },

  componentDidMount() {
    FileUploadingProgressStore.addChangeListener(this.handleFileUploadingProgressStoreChange);

    componentHandler.upgradeElement(this.refs.table);
  },

  componentDidUpdate() {
    const { assemblies, collection } = this.state.receivedResults;
    console.log('----------', assemblies, collection)
    if (!assemblies) {
      return;
    }

    for (const assemblyName of Object.keys(FileUploadingStore.getAssemblyNameToAssemblyIdMap())) {
      const assemblyId = FileUploadingStore.getAssemblyNameToAssemblyIdMap()[assemblyName];
      const results = assemblies[assemblyId];
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
      receivedResults: FileUploadingProgressStore.getReceivedResults(),
    });
  },

  getAssemblyResultElements() {
    const assemblyNameToAssemblyIdMap = FileUploadingStore.getAssemblyNameToAssemblyIdMap();
    const assemblyNames = UploadStore.getAssemblyNames();
    const assemblyResults = this.state.receivedResults.assemblies;

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
          <td style={CELL_STYLE}>
            { assemblyResult.progress === 100 ?
              <i style={ICON_STYLE} className="material-icons">check_circle</i> :
              <div>
                <p style={ASSEMBLY_PERCENT_STYLE}>{`${assemblyResult.progress || 0}%`}</p>
                <div style={ASSEMBLY_PROGRESS_BAR_STYLE} ref={`progress_${assemblyName}`} className="mdl-progress mdl-js-progress"></div>
              </div>
            }
          </td>
          { this.assemblyResultColumns.map((resultName) => {
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

  getCollectionResultElements() {
    const assemblyResults = this.state.receivedResults.collection;

    return (
      <tr>
        { Object.keys(this.collectionResultColumns).map((collectionResultName) => {
          return (
            <td style={CELL_STYLE} key={collectionResultName}>
              <i style={ICON_STYLE} className="material-icons">
                { assemblyResults && assemblyResults[collectionResultName] ?
                  'check_circle' :
                  'radio_button_unchecked' }
              </i>
            </td>
          );
        }) }
      </tr>
    );
  },


  render() {
    return (
      <div>
        <div className="wgsa-upload-progress-table">
          <table ref="table" className="mdl-data-table mdl-shadow--4dp" style={TABLE_STYLE}>
            <thead>
              <tr>
                <td style={CELL_STYLE}></td>
                <td style={HEADER_STYLE}>UPLOAD</td>
                <td style={HEADER_STYLE}>METADATA</td>
                <td style={HEADER_STYLE}>CORE</td>
                <td style={HEADER_STYLE}>FP</td> {
                  this.assemblyResultColumns.indexOf('MLST') !== -1 ?
                    <td style={HEADER_STYLE}>MLST</td> : null
                } {
                  this.assemblyResultColumns.indexOf('PAARSNP') !== -1 ?
                    <td style={HEADER_STYLE}>PAARSNP</td> : null
                }
              </tr>
            </thead>
            <tbody>
              {this.getAssemblyResultElements()}
            </tbody>
          </table>
        </div>

        <div className="wgsa-upload-progress-table">
          <table ref="table" className="mdl-data-table mdl-shadow--4dp" style={TABLE_STYLE}>
            <thead>
              <tr>
                <td style={HEADER_STYLE}>MATRIX</td>
                <td style={HEADER_STYLE}>TREE</td>
                <td style={HEADER_STYLE}>SUBTREES</td>
              </tr>
            </thead>
            <tbody>
              {this.getCollectionResultElements()}
            </tbody>
          </table>
        </div>
      </div>

    );
  },

});

module.exports = UploadingAssembliesProgress;
