import { getSelectedSupportedGenomesList } from '../selection/selectors';
import { getCollectionSummary, getCollectionMetadata } from './selectors';

import { createAsyncConstants } from '../../actions';
import { createCollectionRequest } from './api';

import { showToast } from '../../toast';

export const CREATE_COLLECTION = createAsyncConstants('CREATE_COLLECTION');

function requestCreateCollection(organismId, files, metadata) {
  return {
    type: CREATE_COLLECTION,
    payload: {
      organismId,
      metadata,
      promise: createCollectionRequest(files, organismId, metadata),
    },
  };
}

export function createCollection() {
  return (dispatch, getState) => {
    const state = getState();
    const { organismId } = getCollectionSummary(state);
    const genomes = getSelectedSupportedGenomesList(state);
    const metadata = getCollectionMetadata(state);

    dispatch(requestCreateCollection(organismId, genomes, metadata)).
      catch(() => dispatch(
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
