import React from 'react';
import assign from 'object-assign';

import MetadataUtils from '../../utils/Metadata';
import MetadataDate from './metadata-form/Date.react';
import MetadataActionCreators from '../../actions/MetadataActionCreators';
import InputField from './InputField.react';

var AssemblyMetadata = React.createClass({

  propTypes: {
    assembly: React.PropTypes.object.isRequired
  },

  handleMetadataChange() {
    var columnName = event.target.id;
    var value = event.target.value;
    MetadataActionCreators.setMetadataColumn(this.props.assembly.metadata.fileAssemblyId, columnName, value)
  },

  getMetadataFieldComponents(metadata) {
    var components = [];
    for (var columnName in metadata) {
      if (columnName === 'fileAssemblyId' ||
          columnName === 'assemblyFilename' ||
          columnName === 'geography' ||
          columnName === 'date') {
        continue;
      }

      var inputFieldComponent = <InputField ref={columnName} key={columnName} type="text" label={columnName} value={metadata[columnName]} handleChange={this.handleMetadataChange}/>;
      components.push(inputFieldComponent);
    };
    return components;
  },

  render: function () {
    const { fasta, metadata } = this.props.assembly;
    var metadataFields = this.getMetadataFieldComponents(metadata);
    return (
      <div className="metadata-fields-container">
        <MetadataDate key={fasta.name} assemblyId={fasta.name} date={metadata.date} />
        <div className="metadata-field">
          {metadataFields}
        </div>
      </div>
    );
  }
});

module.exports = AssemblyMetadata;
