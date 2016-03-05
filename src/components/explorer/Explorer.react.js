import React from 'react';

import Layout from './Layout.react';
import UploadProgress from './upload-progress';
import { LoadSpinner, LoadError } from './Loading.react';

import FileUploadingStore, { UPLOAD_FAILED } from '^/stores/FileUploadingStore';

import { statuses } from '^/constants/collection';

export default React.createClass({

  displayName: 'Explorer',

  propTypes: {
    initialise: React.PropTypes.func,
    checkStatus: React.PropTypes.func,
    updateProgress: React.PropTypes.func,
    fetch: React.PropTypes.func,
    reset: React.PropTypes.func,
    status: React.PropTypes.string,
    progress: React.PropTypes.object,
  },

  getInitialState() {
    return {
      uploadFailed: false,
    }
  },

  componentDidMount() {
    this.props.initialise();
    FileUploadingStore.addChangeListener(this.handleFileUploadingStoreChange);
  },

  componentWillReceiveProps({ status }) {
    if (status === statuses.READY) {
      this.props.fetch();
    }
  },

  componentWillUnmount() {
    this.props.reset();
    FileUploadingStore.removeChangeListener(this.handleFileUploadingStoreChange);
    FileUploadingStore.clearStore();
  },

  render() {
    const { progress = {} } = this.props;
    let { status } = this.props;

    if (!status && FileUploadingStore.isUploading()) {
      // this skips the loading spinner when uploading
      status = statuses.PROCESSING;
    }

    if (this.state.uploadFailed) {
      return (
        <LoadError status={UPLOAD_FAILED} />
      );
    }

    if (status === statuses.PROCESSING) {
      const { checkStatus, updateProgress } = this.props;
      return (
        <UploadProgress
          isUploading={FileUploadingStore.isUploading()}
          progress={progress}
          checkStatus={checkStatus}
          updateProgress={updateProgress}
        />
      );
    }

    if (status === statuses.FETCHED) {
      return (
        <Layout />
      );
    }

    if (status && status !== statuses.READY) {
      return (
        <LoadError
          status={status}
          errors={progress ? progress.errors : []}
        />
      );
    }

    return (
      <LoadSpinner />
    );
  },

  handleFileUploadingStoreChange() {
    if (FileUploadingStore.hasFailed()) {
      this.setState({ uploadFailed: true });
    }
  },

});
