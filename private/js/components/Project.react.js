var React = require('react');
var Loading = require('./Loading.react');
var ProjectViewer = require('./ProjectViewer.react');
var NotFound = require('./NotFound.react');
var ApiUtils = require('../utils/Api');
var Data = require('../utils/Data');
var ProjectActionCreators = require('../actions/ProjectActionCreators');
var ProjectStore = require('../stores/ProjectStore');

var Project = React.createClass({

  getInitialState: function () {
    return {
      error: null,
      project: null
    };
  },

  handleProjectStoreChange: function () {
    this.setState({
      project: 'LOADED'
    });
  },

  componentDidMount: function () {
    ProjectStore.addChangeListener(this.handleProjectStoreChange);

    var projectId = this.props.params.projectId;
    ProjectActionCreators.getProject(projectId);
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
        <ProjectViewer query={this.props.query} />
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
