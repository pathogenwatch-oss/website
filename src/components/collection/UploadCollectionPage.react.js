import React from 'react';

import DragAndDropFiles from './DragAndDropFiles.react';
import UploadWorkspace from './UploadWorkspace.react';
import UploadStore from '../../stores/UploadStore';
import FileUploadingStore from '../../stores/FileUploadingStore';

import Species from '../../species';

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

  handleFileUploadingStoreChange: function () {
    const id = FileUploadingStore.getCollectionId();

    if (!id) {
      return;
    }

    const { transitionTo, makePath } = this.context.router;
    transitionTo(makePath('collection', { species: Species.nickname, id }));
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
  },

});

module.exports = UploadCollectionPage;
