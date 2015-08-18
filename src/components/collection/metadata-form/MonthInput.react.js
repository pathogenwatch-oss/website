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

var MonthInput = React.createClass({

  propTypes: {
    assembly: React.PropTypes.object.isRequired
  },

  getInitialState: function () {
    return {
      selectedValue: this.props.assembly.metadata.date.month || DEFAULT_VALUE
    };
  },

  componentWillReceiveProps: function (nextProps) {
    this.setState({
      selectedValue: nextProps.assembly.metadata.date.month || DEFAULT_VALUE
    });
  },

  createOptionElements: function () {
    var months = MetadataUtils.generateMonths();

    return months.map(function createOptionElement(month) {
      return (
        <option value={month.number} key={month.number}>{month.name}</option>
      );
    });
  },

  handleSelect: function (event) {
    var month = event.target.value;
    var fileAssemblyId = this.props.assembly.metadata.fileAssemblyId;

    MetadataActionCreators.setMetadataMonth(fileAssemblyId, month);
  },

  render: function () {
    return (
      <select style={optionsStyle}
        className="form-control"
        value={this.state.selectedValue}
        onChange={this.handleSelect}>

        <option value={DEFAULT_VALUE}>Choose month</option>
        {this.createOptionElements()}
      </select>
    );
  }
});

module.exports = MonthInput;
