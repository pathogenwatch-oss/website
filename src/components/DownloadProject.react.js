var React = require('react');

var DownloadProject = React.createClass({

  propTypes: {
    projectId: React.PropTypes.string.isRequired
  },

  handleClick: function (event) {
    event.preventDefault();
  },

  render: function () {

    var containerStyle = {
      padding: '20px'
    };

    var buttonStyle = {
      marginRight: '5px'
    };

    return (
      <section className="container-fluid" style={containerStyle}>
        <p>Download project files:</p>
        <a href={'/api/1.0/project/' + this.props.projectId + '/download/csv'} className="btn btn-default" style={buttonStyle} handleClick={this.handleClick}>Download CSV file</a>
        <a href={'/api/1.0/project/' + this.props.projectId + '/download/nwk'} className="btn btn-default" style={buttonStyle} handleClick={this.handleClick}>Download NWK file</a>
      </section>
    );
  }
});

module.exports = DownloadProject;
