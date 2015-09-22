import React from 'react';

import MetadataActionCreators from '../../actions/MetadataActionCreators';
import FileUploadingStore from '../../stores/FileUploadingStore.js';

import MetadataDate from './metadata-form/Date.react';
import InputField from './InputField.react';
import Map from './Map.react.js';

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
        console.log(columnName);
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
    const { assemblyName } = metadata;
    const locations = {};

    if (fasta && metadata) {
      locations[fasta.name] = metadata.geography;
    }

    return (
      <form className="metadata-fields">
        <InputField key="assemblyName" type="text" columnName="assemblyName" label="Assembly Name" value={assemblyName} handleChange={this.handleMetadataChange} readonly={this.state.isUploading}/>
        <div className="mdl-grid mdl-grid--no-spacing">
          <div className="mdl-cell mdl-cell--6-col">
            <MetadataDate key={fasta.name} assemblyId={fasta.name} date={metadata.date} disabled={this.state.isUploading}/>
          </div>
          <div className="mdl-cell mdl-cell--6-col">
            <Map width={"100%"} height={100} locations={locations} label="Location" />
          </div>
        </div>
        <div className="metadata-fields__other">
          {this.getMetadataFieldComponents(metadata)}
        </div>
      </form>
    );
  },

});
