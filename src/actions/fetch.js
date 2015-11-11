import { getCollection, getReferenceCollection, getAntibiotics } from '../utils/Api';
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
