import React from 'react';

import MetadataActionCreators from '../../actions/MetadataActionCreators';

import MetadataDate from './metadata-form/Date.react';
import InputField from './InputField.react';
import GoogleMap from '../map/GoogleMap.react';

export default React.createClass({

  displayName: 'AssemblyMetadata',

  propTypes: {
    assembly: React.PropTypes.object.isRequired,
    isUploading: React.PropTypes.bool,
  },

  getMetadataFieldComponents(metadata) {
    return Object.keys(metadata)
      .filter((columnName) => {
        return (
          columnName !== 'assemblyName' &&
          columnName !== 'name' &&
          columnName !== 'position' &&
          columnName !== 'date' &&
          (this.props.isUploading ? metadata[columnName] : true)
        );
      })
      .map((columnName) => {
        return (
          <InputField key={columnName} type="text" label={columnName} value={metadata[columnName]} handleChange={this.handleMetadataChange} readonly={this.props.isUploading}/>
        );
      });
  },

  render() {
    const { fasta, metadata } = this.props.assembly;
    const { assemblyName, position } = metadata;
    const { latitude, longitude } = position;

    const showMap = latitude !== null && longitude !== null;
    const markerDef = { position };
    const otherMetadataFields = this.getMetadataFieldComponents(metadata);

    return (
      <form className="metadata-fields">
        <div className="metadata-fields__main">
          <div className="mdl-grid mdl-grid--no-spacing">
            <div className="mdl-cell mdl-cell--6-col">
              <InputField key="assemblyName" type="text" columnName="assemblyName" label="Assembly Name" value={assemblyName} handleChange={this.handleMetadataChange} readonly={this.props.isUploading}/>
              <MetadataDate key={fasta.name} assemblyId={fasta.name} date={metadata.date} readonly={this.props.isUploading}/>
            </div>
            <div className="mdl-cell mdl-cell--6-col metadata-googlemap">
              { showMap ?
                <GoogleMap markerDefs={[ markerDef ]} /> :
                <p className="mdl-card__supporting-text">(Location not provided)</p> }
            </div>
          </div>
        </div>
        { otherMetadataFields.length ?
          <fieldset className="metadata-fields__other-fieldset">
            <legend>Other Metadata</legend>
            <div className="metadata-fields__other">
              { otherMetadataFields }
            </div>
          </fieldset> : null
        }
      </form>
    );
  },

  handleMetadataChange(columnName, value) {
    MetadataActionCreators.setMetadataColumn(
      this.props.assembly.fasta.name, columnName, value
    );
  },

});
