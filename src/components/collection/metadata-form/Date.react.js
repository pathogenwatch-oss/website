var React = require('react');
var YearInput = require('./YearInput.react');
var MonthInput = require('./MonthInput.react');
var DayInput = require('./DayInput.react');
var Header = require('./Header.react');

var metadataStyle = {
  display: 'inline-block',
  marginRight: '5px'
};

var MetadataDate = React.createClass({

  propTypes: {
    assembly: React.PropTypes.object.isRequired
  },

  render: function () {
    return (
      <div>
        <Header text="Date" />
        <form className="form-inline">

          <div style={metadataStyle}>
            <YearInput assembly={this.props.assembly} />
          </div>

          <div style={metadataStyle}>
            <MonthInput assembly={this.props.assembly} />
          </div>

          <div style={metadataStyle}>
            <DayInput assembly={this.props.assembly} />
          </div>

        </form>
      </div>
    );
  }
});

module.exports = MetadataDate;
