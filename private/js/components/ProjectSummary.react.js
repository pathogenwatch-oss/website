var React = require('react');
var IsProjectListedCheckbox = require('./IsProjectListedCheckbox.react');

var ProjectSummary = React.createClass({

  getProjectMetadataElements: function () {
    var metadata = this.props.metadata;
    var metadataFields = Object.keys(metadata);
    var metadataValue;

    var textStyle = {
      fontSize: '20px',
      color: '#000000',
      margin: '10px 0 20px 0',
      wordWrap: 'break-word'
    };

    var h4Style = {
      fontSize: '16px',
      textTransform: 'uppercase',
      color: '#aaaaaa',
      margin: '0 0 10px 0'
    };

    var missingStyle = {
      color: '#999999',
      fontWeight: '100'
    };

    var listItemStyle = {
      margin: '10px 0'
    };

    var metadataElements = metadataFields.map(function (metadataField) {
      if (metadataField === 'isListed') {
        return;
      }

      metadataValue = metadata[metadataField];

      if (! metadataValue) {
        metadataValue = <span style={missingStyle}>Missing</span>;
      }

      return (
        <li style={listItemStyle} key={metadataField}>
          <h4 style={h4Style}>{metadataField}</h4>
          <p style={textStyle}>{metadataValue}</p>
        </li>
      );
    });

    return metadataElements;
  },

  render: function () {

    var sectionStyle = {
      margin: '20px 0',
      padding: '20px'
    };

    var h2Style = {
      fontSize: '32px',
      color: '#555555',
      fontWeight: '100',
      margin: '0 0 30px 0'
    };

    var listStyle = {
      listStyle: 'none',
      margin: '0 0 20px 0',
      padding: '20px',
      background: '#ffffff',
      border: '1px solid #cccccc'
    };

    return (
      <section style={sectionStyle}>
        <h2 style={h2Style}>Project Overview</h2>
        <ul style={listStyle}>
          {this.getProjectMetadataElements()}
        </ul>

        <IsProjectListedCheckbox
          isProjectListed={this.props.isProjectListed}
          handleSetProjectListedOption={this.props.setIsProjectListed} />

        <div className="row">
          <div className="col-xs-4 text-left">
            <button className="btn btn-primary" onClick={this.props.handleCloseProjectSummary}>Back</button>
          </div>
          <div className="col-xs-8 text-right">
            <button className="btn btn-success" onClick={this.props.handleCreateProject}>Create project</button>
          </div>
        </div>
      </section>
    );
  }
});

module.exports = ProjectSummary;
