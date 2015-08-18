var React = require('react');
var YearInput = require('./YearInput.react');
var MonthInput = require('./MonthInput.react');
var DayInput = require('./DayInput.react');
var Header = require('./Header.react');
var mui = require('material-ui'),
DatePicker = mui.DatePicker;
var ThemeManager = require('material-ui/lib/styles/theme-manager')();
var injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();

var metadataStyle = {
  display: 'inline-block',
  marginRight: '5px'
};

var dateStyle = {
};

var MetadataDate = React.createClass({

  metadataDate: null,

  propTypes: {
    assembly: React.PropTypes.object.isRequired
  },

  childContextTypes: {
    muiTheme: React.PropTypes.object
  },

  getChildContext: function() {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    };
  },

  componentDidMount: function() {
    this.componentDidUpdate();
  },

  componentDidUpdate: function() {
    var metadataDate = this.props.assembly.metadata.date.month+'/'+this.props.assembly.metadata.date.day+'/'+this.props.assembly.metadata.date.year;
    var dateObj = new Date(metadataDate);
    // DatePicker.setDate(this.metadataDate);
  },

  render: function () {
    var metadataDate = this.props.assembly.metadata.date.month+'/'+this.props.assembly.metadata.date.day+'/'+this.props.assembly.metadata.date.year;
    var dateObj = new Date(metadataDate);
    // this.setState({ metadataDate: dateObj });

    return (
      <div>
        <Header text="Date" />
        <form className="form-inline">
          <DatePicker
            hintText="Date"
            autoOk={true}
            style={dateStyle}
            defaultDate={dateObj}
            mode="landscape"/>
        </form>
      </div>
    );
  }
});

module.exports = MetadataDate;
