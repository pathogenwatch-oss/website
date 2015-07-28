var React = require('react');
var Router = require('react-router');
var DragAndDropFiles = require('./DragAndDropFiles.react');
var UploadingFiles = require('./UploadingFiles.react');
var UploadWorkspace = require('./UploadWorkspace.react');
var UploadStore = require('../../stores/UploadStore');
var FileUploadingStore = require('../../stores/FileUploadingStore');

var UploadCollectionPage = React.createClass({

  contextTypes: {
    router: React.PropTypes.func
  },

  getInitialState: function () {
    return {
      hasFiles: false,
      isUploading: false,
      isCollection: false
    };
  },

  componentDidMount: function () {
    UploadStore.addChangeListener(this.handleUploadStoreChange);
    FileUploadingStore.addChangeListener(this.handleFileUploadingStoreChange);
  },

  componentWillUnmount: function () {
    UploadStore.removeChangeListener(this.handleUploadStoreChange);
    FileUploadingStore.removeChangeListener(this.handleFileUploadingStoreChange);
  },

  handleUploadStoreChange: function () {
    this.setState({
      hasFiles: true
    });
  },

  handleFileUploadingStoreChange: function () {
    var fileUploadingResult = FileUploadingStore.getFileUploadingResult();

    if (fileUploadingResult === FileUploadingStore.getFileUploadingResults().NONE) {
      this.setState({
        isUploading: FileUploadingStore.getFileUploadingState()
      });

      return;
    }

    if (fileUploadingResult === FileUploadingStore.getFileUploadingResults().SUCCESS) {

      this.context.router.transitionTo('/project/' + FileUploadingStore.getCollectionId());

      return;
    }
  },

  render: function () {
    if (this.state.isUploading) {
      return (
        <UploadingFiles />
      );
    }

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
