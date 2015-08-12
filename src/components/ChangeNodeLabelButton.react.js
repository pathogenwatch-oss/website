var React = require('react');
var Button = require('./Button.react');

var ChangeNodeLabelButton = React.createClass({

  propTypes: {
    label: React.PropTypes.string.isRequired,
    isActive: React.PropTypes.bool.isRequired,
    handleClick: React.PropTypes.func.isRequired
  },

  handleClick: function () {
    var changeNodeLabelTo = this.props.changeNodeLabelTo;
    this.props.handleClick(changeNodeLabelTo);
  },

  render: function () {
    return (<Button handleClick={this.handleClick} label={this.props.label.replace('__', '')} isActive={this.props.isActive} />);
  }
});

module.exports = ChangeNodeLabelButton;
