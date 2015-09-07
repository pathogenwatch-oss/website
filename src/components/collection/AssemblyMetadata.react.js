import React from 'react';
import assign from 'object-assign';

import MetadataUtils from '../../utils/Metadata';
import MetadataDate from './metadata-form/Date.react';
import MetadataActionCreators from '../../actions/MetadataActionCreators';

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

      var inputFieldComponent = <MetadataField ref={columnName} key={columnName} columnName={columnName} value={metadata[columnName]} handleChange={this.handleMetadataChange}/>;
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
        {metadataFields}
      </div>
    );
  }
});

var MetadataField = React.createClass({

  componentDidMount() {
    var inputDomElement = this.getDOMNode();
    componentHandler.upgradeElement(inputDomElement);
  },

  render() {
    return (
      <div className="metadata-field mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
        <label className="mdl-card__supporting-text">{this.props.columnName}</label>
        <input className="mdl-textfield__input" type="text" id={this.props.columnName}
          value={this.props.value}
          onChange={this.props.handleChange} />
        <label className="mdl-textfield__label" htmlFor={this.props.columnName}></label>
      </div>
    );
  }
});

module.exports = AssemblyMetadata;
