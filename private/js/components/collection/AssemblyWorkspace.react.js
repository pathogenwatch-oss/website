var React = require('react');
var assign = require('object-assign');

var UploadActionCreators = require('../../actions/UploadActionCreators');
var UploadStore = require('../../stores/UploadStore');

var AssemblyMetadata = require('./AssemblyMetadata.react');
var AssemblyAnalysis = require('./AssemblyAnalysis.react');

var AssemblyWorkspace = React.createClass({

  propTypes: {
    assembly: React.PropTypes.object.isRequired
  },

  render: function () {
    return (
      <div className="row">
        <div className="col-md-6">

          <AssemblyMetadata assembly={this.props.assembly} />

        </div>

        <div className="col-md-6">

          <AssemblyAnalysis assembly={this.props.assembly} />

        </div>
      </div>
    );
  }
});

module.exports = AssemblyWorkspace;
