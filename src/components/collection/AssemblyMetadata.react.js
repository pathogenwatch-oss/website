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

    // Set date to 1st day of the year if day or month is missing
    metadata.date.day = metadata.date.day || null;
    metadata.date.month = metadata.date.month || null;
    metadata.date.year = metadata.date.year || null;

    return (
      <div>
        <MetadataDate assemblyId={fasta.name} date={metadata.date} />
      </div>
    );
  }
});

module.exports = AssemblyMetadata;
