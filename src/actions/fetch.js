import {
  checkCollectionStatus,
  getCollection,
  getReferenceCollection,
  getAntibiotics,
} from '../utils/Api';

import { fixPositions, fixDateFormats } from '../utils/Metadata';

export const FETCH_ENTITIES = 'FETCH_ENTITIES';

export const fetchEntities = (speciesId, collectionId) =>
  dispatch => {
    dispatch({ type: FETCH_ENTITIES, ready: false });

    Promise.all([
      getCollection(speciesId, collectionId).then(fixPositions),
      getReferenceCollection(speciesId, collectionId).then(fixDateFormats),
      getAntibiotics(speciesId),
    ]).
    then(
      result => dispatch({ type: FETCH_ENTITIES, ready: true, result }),
      error => dispatch({ type: FETCH_ENTITIES, ready: true, error })
    );
  };

export const CHECK_STATUS = 'CHECK_STATUS';

export function checkStatus(speciesId, collectionId, cas) {
  return {
    type: CHECK_STATUS,
    promise: checkCollectionStatus(speciesId, collectionId, cas),
  };
}

export const UPDATE_PROGRESS = 'UPDATE_PROGRESS';

export function updateProgress(results) {
  return {
    type: UPDATE_PROGRESS,
    results,
  };
}
