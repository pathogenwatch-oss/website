import { getSelectedGenomeList } from '../selection/selectors';
import { getCollectionSummary, getCollectionMetadata } from './selectors';

import { createAsyncConstants } from '~/actions';
import { showToast } from '~/toast';

import { createCollectionRequest } from './api';

export const CREATE_COLLECTION = createAsyncConstants('CREATE_COLLECTION');

function requestCreateCollection(organismId, organismName, files, metadata) {
  return {
    type: CREATE_COLLECTION,
    payload: {
      organismId,
      organismName,
      metadata,
      promise: createCollectionRequest(files, organismId, organismName, metadata),
    },
  };
}

export function createCollection() {
  return (dispatch, getState) => {
    const state = getState();
    const { organismId, organismName } = getCollectionSummary(state);
    const genomes = getSelectedGenomeList(state);
    const metadata = getCollectionMetadata(state);

    return dispatch(requestCreateCollection(organismId, organismName, genomes, metadata))
      .catch(() => dispatch(
        showToast({
          message: 'Your collection could not be created at this time, please try again later.',
        })
      ));
  };
}

export const CHANGE_COLLECTION_METADATA = 'CHANGE_COLLECTION_METADATA';

export function changeCollectionMetadata(field, value) {
  return {
    type: CHANGE_COLLECTION_METADATA,
    payload: {
      [field]: value,
    },
  };
}
