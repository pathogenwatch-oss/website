import { FETCH_SUMMARY } from './actions';
import { OFFLINE_REMOVE_COLLECTION } from '../offline/actions';
import { FETCH_GENOME_SUMMARY } from '../genomes/actions';

const prefilterToKey = {
  all: 'allGenomes',
  user: 'userGenomes',
  bin: 'binnedGenomes',
};

export default function (state = {}, { type, payload }) {
  switch (type) {
    case FETCH_SUMMARY.SUCCESS:
      return {
        ...state,
        ...payload.result,
      };
    case FETCH_GENOME_SUMMARY.SUCCESS: {
      const { filter = {}, result } = payload;
      const key = prefilterToKey[filter.prefilter || 'all'];
      return {
        ...state,
        [key]: result.summary.total,
      };
    }
    case OFFLINE_REMOVE_COLLECTION.SUCCESS:
      return {
        ...state,
        offlineCollections:
          state.offlineCollections > 0 ?
            state.offlineCollections - 1 :
            0,
      };
    default:
      return state;
  }
}
