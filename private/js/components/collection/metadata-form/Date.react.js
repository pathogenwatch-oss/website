var React = require('react');
var YearInput = require('./YearInput.react');
var MonthInput = require('./MonthInput.react');
var DayInput = require('./DayInput.react');

var MetadataDate = React.createClass({

  propTypes: {
    assembly: React.PropTypes.object.isRequired
  },

  render: function () {
    return (
      <div>
        <label>Date</label>
        <form className="form-inline">
          <YearInput assembly={this.props.assembly} />
          <MonthInput assembly={this.props.assembly} />
          <DayInput assembly={this.props.assembly} />
        </form>
      </div>
    );
  }
});

module.exports = MetadataDate;
