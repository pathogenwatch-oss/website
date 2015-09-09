import React from 'react';

import MetadataDate from './metadata-form/Date.react';
import MetadataActionCreators from '../../actions/MetadataActionCreators';
import InputField from './InputField.react';

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

    return (
      <form className="metadata-fields">
        <MetadataDate key={fasta.name} assemblyId={fasta.name} date={metadata.date} />
        <fieldset className="metadata-fields__other">
          <legend>Other</legend>
          {this.getMetadataFieldComponents(metadata)}
        </fieldset>
      </form>
    );
  },

});
