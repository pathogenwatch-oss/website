import { CREATE_COLLECTION } from '../../hub-drawer';
import * as actions from '../actions';

import { sortAssemblies } from '../utils';
import { statuses } from '../../collection-route/constants';

const initialState = { id: null, assemblyIds: new Set(), metadata: {} };

export default function (state = initialState, { type, payload }) {
  switch (type) {
    case CREATE_COLLECTION.SUCCESS: {
      const { result, speciesId, metadata } = payload;
      return {
        ...state,
        id: result && result.collectionId,
        speciesId,
        metadata,
      };
    }
    case actions.FETCH_COLLECTION.FAILURE: {
      return {
        ...state,
        status: statuses.NOT_FOUND,
      };
    }
    case actions.FETCH_COLLECTION.SUCCESS: {
      const { result } = payload;
      return {
        ...state,
        assemblyIds: new Set(sortAssemblies(result.genomes).map(_ => _.uuid)),
        id: result.uuid,
        metadata: {
          title: result.title,
          description: result.description,
          dateCreated: new Date(result.progress.completed).toLocaleDateString(),
        },
        progress: result.progress,
        status: result.status,
        subtrees: result.subtrees.reduce((memo, subtree) => {
          memo[subtree.name] = subtree;
          return memo;
        }, {}),
      };
    }
    case actions.UPDATE_COLLECTION_PROGRESS: {
      const { progress } = payload;
      return {
        ...state,
        progress,
      };
    }
    case actions.FETCH_SPECIES_DATA.FAILURE:
      return {
        ...state,
        status: statuses.NOT_FOUND,
      };
    case actions.FETCH_SPECIES_DATA.SUCCESS:
      return {
        ...state,
        status: statuses.FETCHED,
      };
    default:
      return state;
  }
}
