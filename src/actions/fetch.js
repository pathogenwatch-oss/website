import {
  checkCollectionStatus,
  getCollection,
  getReferenceCollection,
  getAntibiotics,
} from '../utils/Api';

import { fixPositions, fixDateFormats } from '../utils/Metadata';

export const FETCH_ENTITIES = 'FETCH_ENTITIES';

export function fetchEntities(speciesId, collectionId) {
  return {
    type: FETCH_ENTITIES,
    promise: Promise.all([
      getCollection(speciesId, collectionId).then(fixPositions),
      getReferenceCollection(speciesId, collectionId).then(fixDateFormats),
      getAntibiotics(speciesId),
    ]),
  };
}

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
    promise: new Promise(function(resolve, reject){
      resolve(results);
    }),
  };
}
