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

const MetadataDate = React.createClass({

  childContextTypes: {
    muiTheme: React.PropTypes.object
  },

  getChildContext() {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    };
  },

  componentDidMount() {
    var dayElement = React.findDOMNode(this.refs.day_input)
    var monthElement = React.findDOMNode(this.refs.month_input)
    var yearElement = React.findDOMNode(this.refs.year_input)
    componentHandler.upgradeElement(dayElement);
    componentHandler.upgradeElement(monthElement);
    componentHandler.upgradeElement(yearElement);
  },

  // handleDateChange(nil, date) {
  //   MetadataActionCreators.setMetadataDate(this.props.assemblyId, date);
  // },

  handleDateChange() {
    if (event.target.id === 'dd') {
      MetadataActionCreators.setMetadataDay(this.props.assemblyId, event.target.value);
    }
    else if (event.target.id === 'mm') {
      MetadataActionCreators.setMetadataMonth(this.props.assemblyId, event.target.value);
    }
    else if (event.target.id === 'yyyy') {
      MetadataActionCreators.setMetadataYear(this.props.assemblyId, event.target.value);
    }
  },

  render () {
    return (
      <form className="metadata-fields">
        <label className="mdl-card__supporting-text">date</label>
        <DateInput ref="day_input" dateType="dd" handleChange={this.handleDateChange} value={this.props.date.day}/>
        <DateInput ref="month_input" dateType="mm" handleChange={this.handleMonthChange} value={this.props.date.month}/>
        <DateInput ref="year_input" dateType="yyyy" handleChange={this.handleYearChange} value={this.props.date.year}/>
      </form>
    );
  }
});

var DateInput = React.createClass({
  render() {
    return (
      <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
        <input className="mdl-textfield__input" type="text" pattern="-?[0-9]*(\.[0-9]+)?" id={this.props.dateType}
          value={this.props.value}
          onChange={this.props.handleChange} />
        <label className="mdl-textfield__label" htmlFor={this.props.dateType}> {this.props.value ? '' : this.props.dateType} </label>
      </div>
    );
  }
});


module.exports = MetadataDate;
