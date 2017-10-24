import React from 'react';

import Viewer from '../../collection-viewer/component';
import Progress from '../progress';
import { LoadSpinner, LoadError } from '../loading/Loading.react';

import { statuses } from '../constants';

export default createClass({

  displayName: 'Explorer',

  propTypes: {
    updateProgress: PropTypes.func,
    fetch: PropTypes.func,
    reset: PropTypes.func,
    status: PropTypes.string,
    progress: PropTypes.object,
  },

  componentDidMount() {
    this.props.fetch();
  },

  componentDidUpdate({ status }) {
    if (status !== this.props.status && this.props.status === statuses.READY) {
      this.props.fetch();
    }
  },

  componentWillUnmount() {
    this.props.reset();
  },

  render() {
    const { collection } = this.props;

    if (collection.status === statuses.PROCESSING) {
      return (
        <Progress {...this.props} />
      );
    }

    if (collection.status === statuses.READY) {
      return (
        <Viewer />
      );
    }

    if (collection.status && collection.status !== statuses.READY) {
      return (
        <LoadError collection={collection} location={this.props.location} />
      );
    }

    return (
      <LoadSpinner />
    );
  },

});
