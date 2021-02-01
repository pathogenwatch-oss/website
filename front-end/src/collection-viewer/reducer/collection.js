import { CREATE_COLLECTION } from '../../genomes/create-collection-form';
import * as actions from '../actions';
import { COLLECTION_CHANGE_ACCESS_LEVEL } from '../access/actions';

import { sortGenomes } from '../utils';
import { statuses } from '../../collection-viewer/constants';

import Organisms from '../../organisms';

const initialState = { id: null, genomeIds: new Set() };

export default function (state = initialState, { type, payload }) {
  switch (type) {
    case CREATE_COLLECTION.SUCCESS: {
      const { result, organismId, metadata } = payload;
      Organisms.current = organismId;
      return {
        ...state,
        token: result.token,
        organismId,
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
      const { genomes = [], ...result } = payload.result;

      Organisms.current = result.organismId;

      return {
        ...state,
        genomeIds: new Set(sortGenomes(genomes).map(_ => _.uuid)),
        access: result.access,
        createdAt: result.createdAt,
        description: result.description,
        size: result.size,
        organismId: result.organismId,
        owner: result.owner,
        pmid: result.pmid,
        progress: result.progress,
        status: statuses.READY,
        title: result.title,
        token: result.token,
        uuid: result.uuid,
        isClusterView: result.isClusterView || false,
        genomeId: payload.genomeId,
      };
    }
    case COLLECTION_CHANGE_ACCESS_LEVEL.ATTEMPT:
      return {
        ...state,
        access_status: 'LOADING',
        access: payload.access,
      };
    case COLLECTION_CHANGE_ACCESS_LEVEL.SUCCESS:
      return {
        ...state,
        access_status: 'OK',
      };
    case COLLECTION_CHANGE_ACCESS_LEVEL.FAILURE:
      return {
        ...state,
        access_status: 'ERROR',
      };
    default:
      return state;
  }
}
