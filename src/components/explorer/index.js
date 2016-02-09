import React from 'react';
import { Provider, connect } from 'react-redux';

import Explorer from './Explorer.react';

import getStore from '^/store';
import FileUploadingStore from '^/stores/FileUploadingStore';

import { setCollectionId } from '^/actions/collection';
import { checkStatus, fetchEntities } from '^/actions/fetch';
import { resetStore } from '^/actions/reset';

import Species from '^/species';

export const store = getStore();

const connectExplorer = connect(
  ({ collection }) => {
    return {
      status: collection.status,
      progress: collection.progress,
      cas: collection.cas,
    };
  },
  null,
  ({ status, progress, cas }, { dispatch }, { id }) => {
    return {
      status,
      progress,
      cas,
      initialise() {
        dispatch(setCollectionId(id));
        // if uploading, initial status check not necessary
        if (!FileUploadingStore.isUploading()) {
          dispatch(checkStatus(Species.id, id));
        }
      },
      checkStatus: () => dispatch(checkStatus(Species.id, id, cas)),
      fetch: () => dispatch(fetchEntities(Species.id, id)),
      reset: () => dispatch(resetStore()),
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
