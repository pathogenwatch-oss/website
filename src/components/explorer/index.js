import React from 'react';
import { Provider, connect } from 'react-redux';

import Explorer from './Explorer.react';

import getStore from '^/store';

import { setCollectionId } from '^/actions/collection';
import { fetchEntities } from '^/actions/fetch';
import { resetStore } from '^/actions/reset';

import Species from '^/species';

export const store = getStore();

const connectExplorer = connect(
  ({ loading }) => {
    return { loading: loading.collection };
  },
  (dispatch, { id }) => {
    return {
      initialise() {
        dispatch(setCollectionId(id));
        dispatch(fetchEntities(Species.id, id));
      },
      reset() {
        dispatch(resetStore());
      },
    };
  },
);

function addDevTools() {
  if (process.env.NODE_ENV !== 'production') {
    const DevTools = require('^/DevTools').default;
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
