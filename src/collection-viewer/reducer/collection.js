import { CREATE_COLLECTION } from '../../genomes/create-collection-form';
import * as actions from '../actions';

import { sortGenomes, getUuidFromSlug } from '../utils';
import { statuses } from '../../collection-viewer/constants';

import Organisms from '../../organisms';

const initialState = { id: null, genomeIds: new Set() };

export default function (state = initialState, { type, payload }) {
  switch (type) {
    case CREATE_COLLECTION.SUCCESS: {
      const { result, organismId, metadata } = payload;
      return {
        ...state,
        slug: result.slug,
        uuid: getUuidFromSlug(result.slug),
        organismId,
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

      Organisms.current = result.organismId;

      return {
        ...state,
        genomeIds: new Set(sortGenomes(genomes).map(_ => _.uuid)),
        uuid: result.uuid,
        slug: result.slug,
        size: result.size,
        organismId: result.organismId,
        title: result.title,
        description: result.description,
        createdAt: result.createdAt,
        pmid: result.pmid,
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
