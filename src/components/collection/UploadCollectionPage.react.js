import React from 'react';

import DragAndDropFiles from './DragAndDropFiles.react';
import UploadingFilesDetailed from './UploadingFilesDetailed.react';
import UploadWorkspace from './UploadWorkspace.react';
import UploadStore from '../../stores/UploadStore';
import FileUploadingStore from '../../stores/FileUploadingStore';

const UploadCollectionPage = React.createClass({

  contextTypes: {
    router: React.PropTypes.func,
  },

  getInitialState: function () {
    return {
      hasFiles: false,
      isUploading: false,
      isCollection: false,
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
      hasFiles: true,
    });
  },

  setCollectionIdInUrl: function () {
    const collectionId = FileUploadingStore.getCollectionId();

    if (!collectionId) {
      return;
    }

    history.pushState({}, 'Macroreact', `/collection/${collectionId}`);
  },

  handleFileUploadingStoreChange: function () {
    const fileUploadingResult = FileUploadingStore.getFileUploadingResult();
    this.setCollectionIdInUrl();

    if (fileUploadingResult === FileUploadingStore.getFileUploadingResults().NONE) {
      this.setState({
        isUploading: FileUploadingStore.getFileUploadingState(),
      });
      return;
    }

    if (fileUploadingResult === FileUploadingStore.getFileUploadingResults().SUCCESS) {
      this.context.router.transitionTo(`/collection/${FileUploadingStore.getCollectionId()}`);
      return;
    }
  },

  render: function () {
    if (this.state.isUploading) {
      return (
        <UploadingFilesDetailed />
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
  },

});

module.exports = UploadCollectionPage;
