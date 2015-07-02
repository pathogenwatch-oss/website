var React = require('react');

var Tabs = React.createClass({
  handleTabClick: function (event) {
    event.preventDefault();
    this.props.handleTabClick(this.props.name);
  },

  render: function () {
    return (
      <li role="presentation" className={this.props.isActive ? 'active' : ''}>
        <a href="#" aria-controls={this.props.name} role="tab" data-toggle="tab" onClick={this.handleTabClick}>{this.props.label}</a>
      </li>
    );
  }
});

module.exports = Tabs;
