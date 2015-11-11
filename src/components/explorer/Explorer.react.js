import React from 'react';

import Layout from './Layout.react';
import { LoadSpinner, LoadError } from './Loading.react';

export default React.createClass({

  displayName: 'Explorer',

  propTypes: {
    fetchEntities: React.PropTypes.func,
    loading: React.PropTypes.object,
  },

  componentDidMount() {
    this.props.fetchEntities();
  },

  render() {
    const { ready, error } = this.props.loading;

    if (ready) {
      return (
        <Layout />
      );
    }

    if (error) {
      return (
        <LoadError />
      );
    }

    return (
      <LoadSpinner />
    );
  },

});
