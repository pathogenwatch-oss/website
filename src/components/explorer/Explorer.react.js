import React from 'react';

import Layout from './Layout.react';
import { LoadSpinner, LoadError } from './Loading.react';

export default React.createClass({

  displayName: 'Explorer',

  propTypes: {
    initialise: React.PropTypes.func,
    reset: React.PropTypes.func,
    loading: React.PropTypes.object,
  },

  componentDidMount() {
    this.props.initialise();
  },

  componentWillUnmount() {
    this.props.reset();
  },

  render() {
    const { ready, error } = this.props.loading;

    if (error) {
      return (
        <LoadError />
      );
    }

    if (ready) {
      return (
        <Layout />
      );
    }

    return (
      <LoadSpinner />
    );
  },

});
