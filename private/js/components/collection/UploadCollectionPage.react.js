var React = require('react');
var DragAndDropFiles = require('./DragAndDropFiles.react');
var UploadWorkspace = require('./UploadWorkspace.react');
var UploadStore = require('../../stores/UploadStore');

var UploadCollectionPage = React.createClass({

  contextTypes: {
    router: React.PropTypes.func
  },

  getInitialState: function () {
    return {
      hasFiles: false
    };
  },

  componentDidMount: function () {
    UploadStore.addChangeListener(this.handleUploadStoreChange);
  },

  handleUploadStoreChange: function () {
    this.setState({
      hasFiles: true
    });
  },

  render: function () {
    if (this.state.hasFiles) {
      return (
        <UploadWorkspace />
      );
    }

    return (
      <DragAndDropFiles />
    );
  }
});

module.exports = UploadCollectionPage;
