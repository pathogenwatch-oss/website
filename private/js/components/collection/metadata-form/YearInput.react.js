var React = require('react');
var MetadataUtils = require('../../../utils/Metadata');
var MetadataActionCreators = require('../../../actions/MetadataActionCreators');

var MINIMUM_YEAR = 1950;
var DEFAULT_VALUE = '-1';

var YearInput = React.createClass({

  propTypes: {
    assembly: React.PropTypes.object.isRequired
  },

  getInitialState: function () {
    return {
      selectedValue: this.props.assembly.metadata.date.year || DEFAULT_VALUE
    };
  },

  componentWillReceiveProps: function (nextProps) {
    this.setState({
      selectedValue: nextProps.assembly.metadata.date.year || DEFAULT_VALUE
    });
  },

  getCurrentYear: function () {
    return new Date().getFullYear();
  },

  createOptionElements: function () {
    var currentYear = this.getCurrentYear();
    var years = MetadataUtils.generateYears(MINIMUM_YEAR, currentYear);

    return years.map(function createOptionElement(year) {
      return (
        <option value={year} key={year}>{year}</option>
      );
    });
  },

  handleSelect: function (event) {
    var year = event.target.value;
    var fileAssemblyId = this.props.assembly.metadata.fileAssemblyId;

    MetadataActionCreators.setMetadataYear(fileAssemblyId, year);
  },

  render: function () {
    return (
      <select
        className="form-control"
        value={this.state.selectedValue}
        onChange={this.handleSelect}>

        <option value={DEFAULT_VALUE}>Choose year</option>
        {this.createOptionElements()}
      </select>
    );
  }
});

module.exports = YearInput;
