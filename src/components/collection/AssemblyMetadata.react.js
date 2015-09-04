var React = require('react');
var FileDragAndDrop = require('react-file-drag-and-drop');
var assign = require('object-assign');
var moment = require('moment');

var UploadActionCreators = require('../../actions/UploadActionCreators');
var UploadStore = require('../../stores/UploadStore');
var MetadataUtils = require('../../utils/Metadata');
var MetadataDate = require('./metadata-form/Date.react');
var MetadataSource = require('./metadata-form/Source.react');

var AssemblyMetadata = React.createClass({

  propTypes: {
    assembly: React.PropTypes.object.isRequired
  },

  render: function () {
    const { fasta, metadata } = this.props.assembly;

    return (
      <div>
        <MetadataDate key={fasta.name} assemblyId={fasta.name} date={metadata.date} />
      </div>
    );
  }
});

module.exports = AssemblyMetadata;
