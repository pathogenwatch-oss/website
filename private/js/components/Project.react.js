var React = require('react');
var Loading = require('./Loading.react');
var ProjectViewer = require('./ProjectViewer.react');
var NotFound = require('./NotFound.react');
var Api = require('../utils/Api');
var Data = require('../utils/Data');

var Project = React.createClass({

  getInitialState: function () {
    return {
      error: null,
      project: null
    };
  },

  handleGetProject: function (error, project) {
    if (error) {
      this.setState({
        error: error
      });

      return;
    }

    this.setState({
      project: project
    });
  },

  componentDidMount: function () {
    var projectId = this.props.params.projectId;

    Api.getProject(projectId, this.handleGetProject);
  },

  render: function () {

    if (this.state.error) {

      return (
        <NotFound>
          Project not found.
        </NotFound>
      );

    } else if (this.state.project) {

      return (
        <ProjectViewer
          project={this.state.project}
          query={this.props.query} />
      );

    } else {

      return (
        <Loading>
          Loading project...
        </Loading>
      );

    }
  }
});

module.exports = Project;
