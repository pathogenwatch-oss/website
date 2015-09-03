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

  handleDateChange(nil, date) {
    MetadataActionCreators.setMetadataDate(this.props.assemblyId, date);
  },

  handleDayChange() {
    MetadataActionCreators.setMetadataDay(this.props.assemblyId, event.target.value);
  },

  handleMonthChange() {
    MetadataActionCreators.setMetadataMonth(this.props.assemblyId, event.target.value);
  },

  handleYearChange() {
    MetadataActionCreators.setMetadataYear(this.props.assemblyId, event.target.value);
  },

  render () {
    return (
      <form className="metadata-fields">
        <label className="mdl-card__supporting-text">date</label>
        <Day ref="day_input" handleChange={this.handleDayChange} date={this.props.date}/>
        <Month ref="month_input" handleChange={this.handleMonthChange} date={this.props.date}/>
        <Year ref="year_input" handleChange={this.handleYearChange} date={this.props.date}/>
      </form>
    );
  }
});

var Day = React.createClass({
  render() {
    return (
      <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
        <input className="mdl-textfield__input" type="text" pattern="-?[0-9]*(\.[0-9]+)?" id="day"
          value={this.props.date.day}
          onChange={this.props.handleChange} />
        <label className="mdl-textfield__label" htmlFor="day">{this.props.date.day ? '' : 'dd'}</label>
      </div>
    );
  }
});

var Month = React.createClass({
  render() {
    return (
      <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
        <input className="mdl-textfield__input" type="text" pattern="-?[0-9]*(\.[0-9]+)?" id="month"
          value={this.props.date.month}
          onChange={this.props.handleChange} />
        <label className="mdl-textfield__label" htmlFor="month">{this.props.date.month ? '' : 'mm'}</label>
      </div>
    );
  }
});

var Year = React.createClass({
  render() {
    return (
      <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
        <input className="mdl-textfield__input" type="text" pattern="-?[0-9]*(\.[0-9]+)?" id="year"
          value={this.props.date.year}
          onChange={this.props.handleChange} />
        <label className="mdl-textfield__label" htmlFor="year">{this.props.date.year ? '' : 'yyyy'}</label>
      </div>
    );
  }
});

module.exports = MetadataDate;
