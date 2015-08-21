import React from 'react';
import { DatePicker } from 'material-ui';
import createThemeManager from 'material-ui/lib/styles/theme-manager';
import injectTapEventPlugin from "react-tap-event-plugin";

import YearInput from './YearInput.react';
import MonthInput from './MonthInput.react';
import DayInput from './DayInput.react';
import Header from './Header.react';

import MetadataActionCreators from '../../../actions/MetadataActionCreators';


const ThemeManager = createThemeManager();
injectTapEventPlugin();

const metadataStyle = {
  display: 'inline-block',
  marginRight: '5px'
};

const dateStyle = {
};

const MetadataDate = React.createClass({

  childContextTypes: {
    muiTheme: React.PropTypes.object
  },

  getChildContext: function() {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    };
  },

  handleDateChange: function(nil, date) {
    MetadataActionCreators.setMetadataDate(this.props.assemblyId, date);
  },

  render: function () {
    return (
      <div>
        <Header text="Date" />
        <form className="form-inline">
          <DatePicker
            hintText="Date"
            autoOk={true}
            maxDate={new Date()}
            showYearSelector={true}
            style={dateStyle}
            value={this.props.date}
            onChange={this.handleDateChange}
            mode="landscape"/>
        </form>
      </div>
    );
  }
});

module.exports = MetadataDate;
