import React from 'react';
import MetadataActionCreators from '../../../actions/MetadataActionCreators';

const metadataStyle = {
  display: 'inline-block',
  marginRight: '5px'
};

const MetadataDate = React.createClass({

  componentDidMount() {
    var dayElement = React.findDOMNode(this.refs.day_input)
    var monthElement = React.findDOMNode(this.refs.month_input)
    var yearElement = React.findDOMNode(this.refs.year_input)
    componentHandler.upgradeElement(dayElement);
    componentHandler.upgradeElement(monthElement);
    componentHandler.upgradeElement(yearElement);
  },

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
    var dateObj = new Date();
    var year = dateObj.getFullYear();
    return (
      <form className="metadata-fields">
        <label className="mdl-card__supporting-text">date</label>
        <DateInput ref="day_input" dateType="dd" handleChange={this.handleDateChange} min="1" max="31"  value={this.props.date.day}/>
        <DateInput ref="month_input" dateType="mm" handleChange={this.handleDateChange} min="1" max="12" value={this.props.date.month}/>
        <DateInput ref="year_input" dateType="yyyy" handleChange={this.handleDateChange} min="1900" max={year} value={this.props.date.year}/>
      </form>
    );
  }
});

var DateInput = React.createClass({
  render() {
    return (
      <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
        <input className="mdl-textfield__input" type="number" id={this.props.dateType}
          value={this.props.value}
          onChange={this.props.handleChange}
          min={this.props.min || 0} max={this.props.max || 0}/>
        <label className="mdl-textfield__label" htmlFor={this.props.dateType}> {this.props.value ? '' : this.props.dateType} </label>
      </div>
    );
  }
});


module.exports = MetadataDate;
