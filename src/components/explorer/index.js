import '../../css/spinner.css';

import React from 'react';
import { Provider, connect } from 'react-redux';

import { Loading, LoadError } from './Loading.react';
import CollectionExplorer from './CollectionExplorer.react';

import getStore from '^/store';

import { fetchEntities } from '^/actions/fetch';

import Species from '^/species';

const store = getStore();

const Explorer = React.createClass({

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
        <CollectionExplorer />
      );
    }

    if (error) {
      return (
        <LoadError />
      );
    }

    return (
      <Loading />
    );
  },

});

const connectExplorer = connect(
  ({ loading }) => { return { loading }; },
  (dispatch, { id }) => {
    return {
      fetchEntities: dispatch.bind(null, fetchEntities(Species.id, id)),
    };
  }
);

function addDevTools() {
  if (process.env.NODE_ENV !== 'production') {
    const DevTools = require('^/DevTools');
    return (
      <DevTools />
    );
  }
}

export default function ({ params }) {
  const ReduxExplorer = connectExplorer(Explorer);

  return (
    <Provider store={store}>
      <div>
        <ReduxExplorer id={params.id} />
        { addDevTools() }
      </div>
    </Provider>
  );
}
