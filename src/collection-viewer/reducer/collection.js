import { CREATE_COLLECTION } from '../../genomes/create-collection-drawer';
import * as actions from '../actions';

import { sortGenomes, getUuidFromSlug } from '../utils';
import { statuses } from '../../collection-viewer/constants';

import Species from '../../species';

const initialState = { id: null, genomeIds: new Set(), metadata: {} };

export default function (state = initialState, { type, payload }) {
  switch (type) {
    case CREATE_COLLECTION.SUCCESS: {
      const { result, speciesId, metadata } = payload;
      return {
        ...state,
        slug: result.slug,
        uuid: getUuidFromSlug(result.slug),
        speciesId,
        metadata,
        status: statuses.PROCESSING,
      };
    }
    case actions.FETCH_COLLECTION.FAILURE: {
      return {
        ...state,
        status: statuses.NOT_FOUND,
      };
    }
    case actions.FETCH_COLLECTION.SUCCESS: {
      const { genomes = [], ...result } = payload.result;

      Species.current = result.speciesId;

      return {
        ...state,
        genomeIds: new Set(sortGenomes(genomes).map(_ => _.uuid)),
        uuid: result.uuid,
        speciesId: result.speciesId,
        metadata: {
          title: result.title,
          description: result.description,
          dateCreated: new Date(result.progress.completed).toLocaleDateString(),
        },
        progress: result.progress,
        status: result.status,
      };
    }
    case actions.UPDATE_COLLECTION_PROGRESS: {
      const { status, progress } = payload;
      return {
        ...state,
        status,
        progress,
      };
    }
    default:
      return state;
  }
}
