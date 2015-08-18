var React = require('react');
var MetadataUtils = require('../../../utils/Metadata');
var MetadataActionCreators = require('../../../actions/MetadataActionCreators');

var DEFAULT_VALUE = '-1';
var optionsStyle = {
  'backgroundColor': '#eee',
  'height': '40px',
  fontSize: '15px',
  fontWeight: '300',
  lineHeight: '30px',
  cursor: 'pointer'
}
var DayInput = React.createClass({

  propTypes: {
    assembly: React.PropTypes.object.isRequired
  },

  getInitialState: function () {
    return {
      selectedValue: this.props.assembly.metadata.date.day || DEFAULT_VALUE
    };
  },

  componentWillReceiveProps: function (nextProps) {
    this.setState({
      selectedValue: nextProps.assembly.metadata.date.day || DEFAULT_VALUE
    });
  },

  createOptionElements: function () {
    var assembly = this.props.assembly;
    var year = assembly.metadata.date.year;
    var month = assembly.metadata.date.month;
    var days = MetadataUtils.generateDays(year, month);

    return days.map(function createOptionElement(day) {
      return (
        <option value={day} key={day}>{day}</option>
      );
    });
  },

  handleSelect: function (event) {
    var day = event.target.value;
    var fileAssemblyId = this.props.assembly.metadata.fileAssemblyId;

    MetadataActionCreators.setMetadataDay(fileAssemblyId, day);
  },

  render: function () {
    return (
      <select style={optionsStyle}
        className="form-control"
        value={this.state.selectedValue}
        onChange={this.handleSelect}>

        <option value={DEFAULT_VALUE}>Choose day</option>
        {this.createOptionElements()}
      </select>
    );
  }
});

module.exports = DayInput;
