import { OFFLINE_LOAD_COLLECTIONS } from './actions';

import { statuses } from './constants';

const initialState = {
  status: statuses.LOADING,
  collections: [],
};

export default function (state = initialState, { type, payload }) {
  switch (type) {
    case OFFLINE_LOAD_COLLECTIONS.ATTEMPT:
      return {
        ...state,
        status: statuses.LOADING,
      };
    case OFFLINE_LOAD_COLLECTIONS.SUCCESS:
      return {
        status: statuses.SUCCESS,
        collections: payload.result.map(collection => ({
          ...collection,
          createdAt: new Date(collection.createdAt),
        })),
      };
    default:
      return state;
  }
}
