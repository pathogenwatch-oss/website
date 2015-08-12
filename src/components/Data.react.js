var React = require('react');
var TableMetadata = require('./table/metadata/Table.react');
var TableResistanceProfile = require('./table/resistance-profile/Table.react');

// var Filters = require('./Filters.react');
// var AboutProject = require('./AboutProject.react');
// var DownloadProject = require('./DownloadProject.react');

var ProjectNavigationStore = require('../stores/ProjectNavigationStore');

var sectionStyle = {
  width: '100%',
  height: '100%'
};

// var showStyle = {
//   display: 'block',
//   width: '100%',
//   height: '100%'
// };
//
// var hideStyle = {
//   display: 'none'
// };

var Data = React.createClass({

  getInitialState: function () {
    return {
      activeProjectNavigation: null
    };
  },

  componentDidMount: function () {
    ProjectNavigationStore.addChangeListener(this.handleProjectNavigationStoreChange);

    this.setState({
      activeProjectNavigation: ProjectNavigationStore.getProjectNavigation()
    });
  },

  componentWillUnmount: function () {
    ProjectNavigationStore.removeChangeListener(this.handleProjectNavigationStoreChange);
  },

  handleProjectNavigationStoreChange: function () {
    this.setState({
      activeProjectNavigation: ProjectNavigationStore.getProjectNavigation()
    });
  },

  getProjectDataComponent: function () {
    var activeProjectNavigation = this.state.activeProjectNavigation;
    var PROJECT_NAVIGATION_STATES = ProjectNavigationStore.getProjectNavigationStates();

    if (! activeProjectNavigation) {
      return null;
    }

    if (activeProjectNavigation === PROJECT_NAVIGATION_STATES.TABLE_METADATA) {

      return <TableMetadata />;

    } else if (activeProjectNavigation === PROJECT_NAVIGATION_STATES.TABLE_RESISTANCE_PROFILE) {

      return <TableResistanceProfile />;

    }
  },

  render: function () {
    return (
      <section style={sectionStyle}>
        {this.getProjectDataComponent()}
      </section>
    );
  }
});

module.exports = Data;
