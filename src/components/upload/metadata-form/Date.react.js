import React from 'react';
import MetadataActionCreators from '^/actions/MetadataActionCreators';

const CURRENT_YEAR = new Date().getFullYear();

const dayStyle = {
  width: '56px',
};

const monthStyle = {
  width: '80px',
};

const yearStyle = {
  width: '64px',
};

const MetadataDate = React.createClass({

  render() {
    const { day, month, year } = this.props.date;
    return (
      <fieldset className="metadata-field__date">
        <legend>Date</legend>
        <DateInput style={dayStyle} onChange={this.updateDateComponent} component="day" min="1" max="31"  value={day} readonly={this.props.readonly} />
        <DateInput style={monthStyle} onChange={this.updateDateComponent} component="month" min="1" max="12" value={month} readonly={this.props.readonly} />
        <DateInput style={yearStyle} onChange={this.updateDateComponent} component="year" min="1900" max={CURRENT_YEAR} value={year} readonly={this.props.readonly} />
      </fieldset>
    );
  },

  updateDateComponent(component, value) {
    MetadataActionCreators.setMetadataDateComponent(
      this.props.assemblyId, component, value
    );
  },

});

const DateInput = React.createClass({

  componentDidMount() {
    componentHandler.upgradeElement(this.refs.mdlElement);
  },

  render() {
    const { component, min, max, value } = this.props;
    return (
      <div ref="mdlElement" className={`mdl-textfield mdl-js-textfield mdl-textfield--floating-label ${this.props.readonly ? 'wgsa-textfield-readonly' : ''}`}
        style={this.props.style}>
        <input className="mdl-textfield__input" type="number" id={component}
          value={value}
          onChange={this.handleChange}
          min={min || 0} max={max || 0}
          readOnly={this.props.readonly} />
        <label className="mdl-textfield__label" htmlFor={component}>{component}</label>
      </div>
    );
  },

  handleChange(event) {
    this.props.onChange(this.props.component, event.target.value);
  },

});


module.exports = MetadataDate;
