import React from 'react';

import CollectionViewer from '../../collection-viewer';
import UploadProgress from '../upload-progress';
import { LoadSpinner, LoadError } from '../loading/Loading.react';

import { statuses } from '../constants';

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
  },

  render() {
    const { progress = {}, status } = this.props;

    if (status === statuses.PROCESSING) {
      return (
        <UploadProgress {...this.props} />
      );
    }

    if (status === statuses.FETCHED) {
      return (
        <CollectionViewer />
      );
    }

    if (status && status !== statuses.READY) {
      return (
        <LoadError
          status={status}
          progress={progress || {}}
        />
      );
    }

    return (
      <LoadSpinner />
    );
  },

});
