var React = require('react');
var MetadataUtils = require('../../../utils/Metadata');
var MetadataActionCreators = require('../../../actions/MetadataActionCreators');

var DEFAULT_VALUE = -1;
var SOURCES = {
  HUMAN: {
    label: 'Human',
    value: 1
  },
  LIVESTOCK: {
    label: 'Livestock',
    value: 2
  },
  BIOSPHERE: {
    label: 'Biosphere',
    value: 3
  },
  ENVIRONMENT: {
    label: 'Environment',
    value: 4
  }
};

var SourceInput = React.createClass({

  propTypes: {
    assembly: React.PropTypes.object.isRequired
  },

  getInitialState: function () {
    return {
      selectedValue: this.props.assembly.metadata.source || DEFAULT_VALUE
    };
  },

  componentWillReceiveProps: function (nextProps) {
    this.setState({
      selectedValue: nextProps.assembly.metadata.source || DEFAULT_VALUE
    });
  },

  createOptionElements: function () {
    var sourceIds = Object.keys(SOURCES);
    var source;

    return sourceIds.map(function createOptionElement(sourceId) {
      source = SOURCES[sourceId];

      return (
        <option value={source.value} key={source.value}>{source.label}</option>
      );
    });
  },

  handleSelect: function (event) {
    var source = event.target.value;
    var fileAssemblyId = this.props.assembly.metadata.fileAssemblyId;

    MetadataActionCreators.setMetadataSource(fileAssemblyId, source);
  },

  render: function () {
    return (
      <select
        className="form-control"
        value={this.state.selectedValue}
        onChange={this.handleSelect}>

        <option value={DEFAULT_VALUE}>Choose source</option>
        {this.createOptionElements()}
      </select>
    );
  }
});

module.exports = SourceInput;
