import React from 'react';

import Layout from './Layout.react';
import UploadProgress from './upload-progress';
import { LoadSpinner, LoadError } from './Loading.react';

import { statuses } from '^/constants/collection';

export default React.createClass({

  displayName: 'Explorer',

  propTypes: {
    initialise: React.PropTypes.func,
    fetch: React.PropTypes.func,
    reset: React.PropTypes.func,
    status: React.PropTypes.string,
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
    const { status } = this.props;

    if (status === statuses.NOT_FOUND) {
      return (
        <LoadError />
      );
    }

    if (status === statuses.PROCESSING) {
      return (<UploadProgress />);
    }

    if (status === statuses.FETCHED) {
      return (
        <Layout />
      );
    }

    return (
      <LoadSpinner />
    );
  },

});
