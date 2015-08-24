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
    const date = moment();

    // Set date to 1st day of the year if day or month is missing
    metadata.date.day = metadata.date.day || 1;
    metadata.date.month = metadata.date.month || 1;
    metadata.date.year = metadata.date.year || date.year();

    date.set({
      year: metadata.date.year,
      month: metadata.date.month - 1,
      date: metadata.date.day
    });

    return (
      <div>
        <MetadataDate assemblyId={fasta.name} date={date.toDate()} />
      </div>
    );
  }
});

module.exports = AssemblyMetadata;
