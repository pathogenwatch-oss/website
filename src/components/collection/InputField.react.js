import React from 'react';

var InputField = React.createClass({

  componentDidMount() {
    var inputDomElement = this.getDOMNode();
    componentHandler.upgradeElement(inputDomElement);
  },

  render: function () {
    return (
      <div className="mdl-textfield mdl-js-textfield">
        <label className="mdl-card__supporting-text">{this.props.label}</label>
        <input className="mdl-textfield__input" type={this.props.type} id={this.props.label}
          value={this.props.value}
          onChange={this.props.handleChange} />
        <label className="mdl-textfield__label" htmlFor={this.props.label}></label>
      </div>
    );
  }
});

module.exports = InputField;
