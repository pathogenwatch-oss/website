import React from 'react';
import { connect } from 'react-redux';

import Explorer from './Explorer.react';

import { setCollectionId } from '^/actions/collection';
import { checkStatus, fetchEntities, updateProgress } from '^/actions/fetch';
import { resetStore } from '^/actions/reset';

import { getProgressPercentage } from '../../collection/selectors.js';

import Species from '^/species';

const connectExplorer = connect(
  ({ collection }) => ({
    status: collection.status,
    progress: collection.progress,
    cas: collection.cas,
    metadata: collection.metadata,
    percentage: getProgressPercentage(collection),
  }),
  null,
  (state, { dispatch }, { id }) => ({
    ...state,
    initialise() {
      dispatch(setCollectionId(id));
      dispatch(checkStatus(Species.id, id));
    },
    checkStatus: () => dispatch(checkStatus(Species.id, id, state.cas)),
    updateProgress: results => dispatch(updateProgress(results)),
    fetch: () => dispatch(fetchEntities(Species.id, id)),
    reset: () => dispatch(resetStore()),
  }),
);

export default function ({ params }) {
  const ReduxExplorer = connectExplorer(Explorer);

  return (
    <ReduxExplorer id={params.id} />
  );
}
