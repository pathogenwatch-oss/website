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


const ASSEMBLY_RESULT_COLUMNS = FileUploadingStore.getAssemblyProcessingResults();
const COLLECTION_RESULT_COLUMNS = FileUploadingStore.getCollectionProcessingResults();

const AssemblyProgressRow = React.createClass({

  propTypes: {
    assemblyName: React.PropTypes.string,
    results: React.PropTypes.object,
  },

  shouldComponentUpdate(nextProps) {
    return nextProps.results !== this.props.results;
  },

  componentDidUpdate() {
    const { results } = this.props;

    if (results.progress && !results.uploaded) {
      this.refs[`progress_${this.props.assemblyName}`]
        .MaterialProgress.setProgress(results.progress);
    }
  },

  render() {
    const { assemblyName, results } = this.props;

    return (
      <tr key={assemblyName}>
        <td style={FILE_ASSEMBLY_ID_STYLE} className="mdl-data-table__cell--non-numeric">{assemblyName}</td>
        <td style={CELL_STYLE}>
          { results.uploaded ?
            <i style={ICON_STYLE} className="material-icons">check_circle</i> :
            <div>
              <p style={ASSEMBLY_PERCENT_STYLE}>{`${results.progress || 0}%`}</p>
              <div style={ASSEMBLY_PROGRESS_BAR_STYLE} ref={`progress_${assemblyName}`} className="mdl-progress mdl-js-progress"></div>
            </div>
          }
        </td>
        { ASSEMBLY_RESULT_COLUMNS.map((resultName) => {
          return (
            <td style={CELL_STYLE} key={`${assemblyName}-${resultName}`}>
              <i style={ICON_STYLE} className="material-icons">
              { results[resultName] ?
                  'check_circle' :
                  'radio_button_unchecked' }
              </i>
            </td>
          );
        }) }
      </tr>
    );
  },

});

const UploadingAssembliesProgress = React.createClass({

  // dummy object to stop rows updating through immutability
  noResults: {},

  getInitialState() {
    return {
      results: {},
    };
  },

  componentDidMount() {
    FileUploadingProgressStore.addChangeListener(this.handleFileUploadingProgressStoreChange);
    // componentHandler.upgradeElement(this.refs.table);
  },

  componentWillUnmount() {
    FileUploadingProgressStore.removeChangeListener(this.handleFileUploadingProgressStoreChange);
  },

  getCollectionResultElements() {
    const collectionResults = this.state.results.collection;

    return (
      <tr>
        { Object.keys(COLLECTION_RESULT_COLUMNS).map((collectionResultName) => {
          return (
            <td style={CELL_STYLE} key={collectionResultName}>
              <i style={ICON_STYLE} className="material-icons">
                { collectionResults && collectionResults[collectionResultName] ?
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
    const { assemblies = {} } = this.state.results;
    return (
      <div>
        <div className="wgsa-upload-progress-table">
          <table ref="table" className="mdl-data-table mdl-shadow--4dp" style={TABLE_STYLE}>
            <thead>
              <tr>
                <td style={CELL_STYLE}></td>
                <td style={HEADER_STYLE}>UPLOAD</td>
                <td style={HEADER_STYLE}>CORE</td>
                <td style={HEADER_STYLE}>FP</td> {
                  ASSEMBLY_RESULT_COLUMNS.indexOf('MLST') !== -1 ?
                    <td style={HEADER_STYLE}>MLST</td> : null
                } {
                  ASSEMBLY_RESULT_COLUMNS.indexOf('PAARSNP') !== -1 ?
                    <td style={HEADER_STYLE}>PAARSNP</td> : null
                }
              </tr>
            </thead>
            <tbody>
              {UploadStore.getAssemblyNames().map(assemblyName => {
                const assemblyId = FileUploadingStore.getAssemblyId(assemblyName);
                const results = assemblyId && assemblies[assemblyId];
                return (
                  <AssemblyProgressRow
                    key={assemblyName}
                    assemblyName={assemblyName}
                    results={results || this.noResults}
                  />
                );
              })}
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

  handleFileUploadingProgressStoreChange() {
    this.setState({
      results: FileUploadingProgressStore.getResults(),
    });
  },

});

module.exports = UploadingAssembliesProgress;
