import React from 'react';

import Viewer from '../component';
import { LoadSpinner, LoadError } from '../loading/Loading.react';

import { statuses } from '../constants';

export default React.createClass({

  displayName: 'Explorer',

  propTypes: {
    fetch: React.PropTypes.func,
    reset: React.PropTypes.func,
    status: React.PropTypes.string,
    progress: React.PropTypes.object,
  },

  componentDidMount() {
    this.props.fetch();
  },

  componentWillUnmount() {
    this.props.reset();
  },

  render() {
    const { collection } = this.props;

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
