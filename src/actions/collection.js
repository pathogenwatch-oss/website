import { getCollection, getReferenceCollection } from '../utils/Api';
import { fixPositions, fixDateFormats } from '../utils/Metadata';

export const SET_COLLECTION = 'SET_COLLECTION';

export function fetchCollection(speciesId, collectionId) {
  return {
    type: SET_COLLECTION,
    promise: Promise.all([
      getCollection(speciesId, collectionId).then(fixPositions),
      getReferenceCollection(speciesId, collectionId).then(fixDateFormats),
    ]),
  };
}
