var React = require('react');
var assign = require('object-assign');

var UploadActionCreators = require('../../actions/UploadActionCreators');
var UploadStore = require('../../stores/UploadStore');

var AssemblyMetadata = require('./AssemblyMetadata.react');
var AssemblyAnalysis = require('./AssemblyAnalysis.react');
var AssemblyWorkspaceHeader = require('./AssemblyWorkspaceHeader.react');

var containerStyle = {
  padding: '10px 0'
};

var AssemblyWorkspace = React.createClass({

  propTypes: {
    assembly: React.PropTypes.object.isRequired
  },

  render: function () {
    return (
      <div style={containerStyle}>
        <div className="container">
          <div className="row">

            <div className="col-md-6">

              <AssemblyWorkspaceHeader text="Metadata" />
              <AssemblyMetadata assembly={this.props.assembly} />

            </div>

            <div className="col-md-6">

              <AssemblyWorkspaceHeader text="Analysis" />
              <AssemblyAnalysis assembly={this.props.assembly} />

            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = AssemblyWorkspace;
