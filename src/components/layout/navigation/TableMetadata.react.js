var React = require('react');

var ProjectNavigationStore = require('../../../stores/ProjectNavigationStore');
var ProjectNavigationActionCreators = require('../../../actions/ProjectNavigationActionCreators');

var style = {
  display: 'inline-block',
  margin: '0 5px',
  lineHeight: '24px',
  cursor: 'pointer'
};

var TableMetadata = React.createClass({

  handleClick: function () {
    var PROJECT_NAVIGATION_STATES = ProjectNavigationStore.getProjectNavigationStates();
    ProjectNavigationActionCreators.setProjectNavigation(PROJECT_NAVIGATION_STATES.TABLE_METADATA);
  },

  render: function () {
    return (
      <i className="fa fa-font" onClick={this.handleClick} title="Label" style={style}></i>
    );
  }
});

module.exports = TableMetadata;
