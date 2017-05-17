import { FETCH_SUMMARY } from './actions';
import { OFFLINE_REMOVE_COLLECTION } from '../offline/actions';

export default function (state = {}, { type, payload }) {
  switch (type) {
    case FETCH_SUMMARY.SUCCESS:
      return {
        ...state,
        ...payload.result,
      };
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
