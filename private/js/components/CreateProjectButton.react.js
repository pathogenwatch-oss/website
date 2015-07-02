var React = require('react');

var CreateProjectButton = React.createClass({
  render: function () {
    return (
      <button className="btn btn-success" onClick={this.props.handleCreateProject}>Create Project</button>
    );
  }
});

module.exports = CreateProjectButton;
