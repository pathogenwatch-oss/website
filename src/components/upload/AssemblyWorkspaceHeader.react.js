var React = require('react');

var style = {
  margin: '25px 0',
  fontSize: '24px',
  fontWeight: '300',
  textShadow: '1px 1px #fff'
};

var AssemblyWorkspaceHeader = React.createClass({

  propTypes: {
    text: React.PropTypes.string.isRequired
  },

  render: function () {
    return (
      <h2 style={style}>{this.props.text}</h2>
    );
  }
});

module.exports = AssemblyWorkspaceHeader;
