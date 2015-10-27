import React from 'react';

import MetadataActionCreators from '../../actions/MetadataActionCreators';
import FileUploadingStore from '../../stores/FileUploadingStore.js';

import MetadataDate from './metadata-form/Date.react';
import InputField from './InputField.react';
import GoogleMap from '../map/GoogleMap.react';

export default React.createClass({

  displayName: 'AssemblyMetadata',

  propTypes: {
    assembly: React.PropTypes.object.isRequired,
  },

  getInitialState() {
    return {
      isUploading: FileUploadingStore.getFileUploadingState(),
    };
  },

  componentDidMount() {
    FileUploadingStore.addChangeListener(this.handleFileUploadingStoreChange);
  },

  componentWillUnmount() {
    FileUploadingStore.removeChangeListener(this.handleFileUploadingStoreChange);
  },

  handleFileUploadingStoreChange() {
    this.setState({
      isUploading: FileUploadingStore.getFileUploadingState(),
    });
  },

  handleMetadataChange(columnName, value) {
    MetadataActionCreators.setMetadataColumn(
      this.props.assembly.fasta.name, columnName, value
    );
  },

  getMetadataFieldComponents(metadata) {
    return Object.keys(metadata)
      .filter((columnName) => {
        return (
          columnName !== 'assemblyName' &&
          columnName !== 'name' &&
          columnName !== 'geography' &&
          columnName !== 'date' &&
          (this.state.isUploading ? metadata[columnName] : true)
        );
      })
      .map((columnName) => {
        return (
          <InputField key={columnName} type="text" label={columnName} value={metadata[columnName]} handleChange={this.handleMetadataChange} readonly={this.state.isUploading}/>
        );
      });
  },

  render() {
    const { fasta, metadata } = this.props.assembly;
    const { assemblyName, geography } = metadata;
    const { latitude, longitude } = geography.position;

    const showMap = latitude !== null && longitude !== null;

    const markerDef = {
      position: geography.position,
    };

    return (
      <form className="metadata-fields">
        <div className="mdl-grid mdl-grid--no-spacing" style={{ justifyContent: 'flexstart' }}>
          <div className="mdl-cell mdl-cell--6-col" style={{ paddingRight: '16px' }}>
            <InputField key="assemblyName" type="text" columnName="assemblyName" label="Assembly Name" value={assemblyName} handleChange={this.handleMetadataChange} readonly={this.state.isUploading}/>
            <MetadataDate key={fasta.name} assemblyId={fasta.name} date={metadata.date} disabled={this.state.isUploading}/>
          </div>
          <div className="mdl-cell mdl-cell--6-col" style={{ position: 'relative'}}>
            { showMap ?
              <GoogleMap markerDefs={[ markerDef ]} /> :
              <p className="mdl-card__supporting-text">(Location not provided)</p> }
          </div>
        </div>
        <div className="metadata-fields__other">
          {this.getMetadataFieldComponents(metadata)}
        </div>
      </form>
    );
  },

});
