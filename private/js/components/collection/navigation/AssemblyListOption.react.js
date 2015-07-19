var React = require('react');

var Component = React.createClass({
  propTypes: {
    fileAssemblyId: React.PropTypes.string.isRequired
  },

  render: function () {
    return (
      <option value={this.props.fileAssemblyId}>{this.props.fileAssemblyId}</option>
    );
  }
});

module.exports = Component;
