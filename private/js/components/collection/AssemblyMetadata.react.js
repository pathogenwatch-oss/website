var React = require('react');
var FileDragAndDrop = require('react-file-drag-and-drop');
var assign = require('object-assign');
var UploadActionCreators = require('../../actions/UploadActionCreators');
var UploadStore = require('../../stores/UploadStore');

var MetadataUtils = require('../../utils/Metadata');

var MetadataDate = require('./metadata-form/Date.react');

var fullWidthAndHeightStyle = {
  width: '100%',
  height: '100%'
};

var AssemblyMetadata = React.createClass({

  propTypes: {
    assembly: React.PropTypes.object.isRequired
  },

  render: function () {
    return (
      <form>
        <div className="form-group">

          <MetadataDate />

        </div>
      </form>
    );
  }
});

module.exports = AssemblyMetadata;
