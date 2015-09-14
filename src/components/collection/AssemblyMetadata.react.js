import React from 'react';

import MetadataDate from './metadata-form/Date.react';
import MetadataActionCreators from '../../actions/MetadataActionCreators';
import InputField from './InputField.react';
import Map from './Map.react.js';

export default React.createClass({

  displayName: 'AssemblyMetadata',

  propTypes: {
    assembly: React.PropTypes.object.isRequired,
  },

  handleMetadataChange(event) {
    const columnName = event.target.id;
    const value = event.target.value;
    MetadataActionCreators.setMetadataColumn(
      this.props.assembly.metadata.assemblyName, columnName, value
    );
  },

  getMetadataFieldComponents(metadata) {
    return Object.keys(metadata)
      .filter((columnName) => {
        return (columnName !== 'assemblyName' &&
                columnName !== 'name' &&
                columnName !== 'geography' &&
                columnName !== 'date');
      })
      .map((columnName) => {
        return (
          <InputField ref={columnName} key={columnName} type="text" label={columnName} value={metadata[columnName]} handleChange={this.handleMetadataChange}/>
        );
      });
  },

  render: function () {
    const { fasta, metadata } = this.props.assembly;
    const locations = {};
    if (this.props.assembly) {
      locations[this.props.assembly.fasta.name] = this.props.assembly.metadata.geography;
    }

    return (
      <form className="metadata-fields">
        <div className="mdl-grid mdl-grid--no-spacing">
          <div className="mdl-cell mdl-cell--6-col">
            <MetadataDate key={fasta.name} assemblyId={fasta.name} date={metadata.date} />
          </div>
          <div className="mdl-cell mdl-cell--6-col">
            <Map width={"100%"} height={100} locations={locations} label="Location" />
          </div>
        </div>
        <fieldset className="metadata-fields__other">
          <legend>Other</legend>
          {this.getMetadataFieldComponents(metadata)}
        </fieldset>
      </form>
    );
  },

});
