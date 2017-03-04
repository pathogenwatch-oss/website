import { getSelectedGenomeList } from '../selection/selectors';
import { getCollectionMetadata } from './selectors';

import { createAsyncConstants } from '../../actions';
import { createCollectionRequest } from './api';

import { showToast } from '../../toast';

export const CREATE_COLLECTION = createAsyncConstants('CREATE_COLLECTION');

function createCollectionAction(files, metadata) {
  const speciesId = files[0].speciesId;
  return {
    type: CREATE_COLLECTION,
    payload: {
      speciesId,
      metadata,
      promise: createCollectionRequest(files, speciesId, metadata),
    },
  };
}

export function createCollection() {
  return (dispatch, getState) => {
    const state = getState();
    const genomes = getSelectedGenomeList(state);
    const metadata = getCollectionMetadata(state);
    dispatch(createCollectionAction(genomes, metadata)).
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
