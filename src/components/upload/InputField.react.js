import React from 'react';
import ReactDOM from 'react-dom';

export default React.createClass({

  displayName: 'InputField',

  componentDidMount() {
    componentHandler.upgradeElement(ReactDOM.findDOMNode(this));
  },

  render() {
    return (
      <div className={`metadata-input-field mdl-textfield mdl-js-textfield mdl-textfield--floating-label ${this.props.readonly ? 'wgsa-textfield-readonly' : ''}`}>
        <input className="mdl-textfield__input" type={this.props.type} id={this.props.label}
          value={this.props.value}
          onChange={this.handleChange}
          readOnly={this.props.readonly}
          style={this.props.style}
        />
        <label className="mdl-textfield__label" htmlFor={this.props.label}>{this.props.label}</label>
      </div>
    );
  },

  handleChange(event) {
    this.props.handleChange(this.props.columnName || this.props.label, event.target.value);
  },

});
