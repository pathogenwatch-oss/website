import React from 'react';

import Layout from './Layout.react';
import UploadProgress from './upload-progress';
import { LoadSpinner, LoadError } from './Loading.react';

import FileUploadingStore from '^/stores/FileUploadingStore';

import { statuses } from '^/constants/collection';

export default React.createClass({

  displayName: 'Explorer',

  propTypes: {
    initialise: React.PropTypes.func,
    checkStatus: React.PropTypes.func,
    fetch: React.PropTypes.func,
    reset: React.PropTypes.func,
    status: React.PropTypes.string,
    progress: React.PropTypes.object,
  },

  componentDidMount() {
    this.props.initialise();
  },

  componentWillReceiveProps({ status }) {
    if (status === statuses.READY) {
      this.props.fetch();
    }
  },

  componentWillUnmount() {
    this.props.reset();
    FileUploadingStore.clearStore();
  },

  render() {
    const { progress = {} } = this.props;
    let { status } = this.props;

    if (!status && FileUploadingStore.isUploading()) {
      // this skips the loading spinner when uploading
      status = statuses.PROCESSING;
    }

    if (status === statuses.PROCESSING) {
      const { checkStatus } = this.props;
      return (
        <UploadProgress
          isUploading={FileUploadingStore.isUploading()}
          progress={progress}
          checkStatus={checkStatus}
          updateProgress={this.props.updateProgress}
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

});
