var React = require('react');
var Button = require('./Button.react');

var ChangeMapMarkerButton = React.createClass({
  render: function () {
    return (<Button handleClick={this.props.handleClick} label={this.props.label} isActive={this.props.isActive} />);
  }
});

module.exports = ChangeMapMarkerButton;
