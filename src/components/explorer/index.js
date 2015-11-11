import React from 'react';
import { Provider, connect } from 'react-redux';

import Explorer from './Explorer.react';

import getStore from '^/store';

import { fetchEntities } from '^/actions/fetch';

import Species from '^/species';

const store = getStore();

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
