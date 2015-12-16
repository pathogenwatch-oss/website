import React from 'react';

import MetadataActionCreators from '^/actions/MetadataActionCreators';

import MetadataDate from './metadata-form/Date.react';
import InputField from './InputField.react';
import GoogleMap from '../GoogleMap.react';

import MapUtils from '^/utils/Map';

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
          columnName !== 'pmid' &&
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
    const { assemblyName, position, date, pmid } = metadata;
    const { latitude, longitude } = position;

    const showMap = latitude !== null && longitude !== null;
    const markerDef = {
      position,
      active: true,
      icon: MapUtils.standardMarkerIcon,
    };
    const additionalMetadataFields = this.getMetadataFieldComponents(metadata);

    return (
      <form className="metadata-fields">
        <div className="metadata-fields__main">
          <div className="mdl-grid mdl-grid--no-spacing">
            <div className="mdl-cell mdl-cell--6-col">
              <InputField key="assemblyName" type="text" columnName="assemblyName" label="Assembly Name" value={assemblyName} handleChange={this.handleMetadataChange} readonly={this.props.isUploading}/>
              <InputField key="pmid" type="text" columnName="pmid" label="PMID" value={pmid} handleChange={this.handleMetadataChange} readonly={this.props.isUploading}/>
              <MetadataDate key={fasta.name} assemblyId={fasta.name} date={date} readonly={this.props.isUploading}/>
            </div>
            <div className="mdl-cell mdl-cell--6-col metadata-googlemap">
              { showMap ?
                <GoogleMap markerDefs={[ markerDef ]} resetMarkers /> :
                <p className="mdl-card__supporting-text">(Location not provided)</p> }
            </div>
          </div>
        </div>
        { additionalMetadataFields.length ?
          <fieldset className="metadata-fields__other-fieldset">
            <legend>Additional Metadata</legend>
            <div className="metadata-fields__other">
              { additionalMetadataFields }
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
