// import { createAsyncConstants } from '../actions';

import { FETCH_COLLECTION } from '../collection-viewer/actions';
import * as api from './api';

// export const FETCH_CLUSTER = createAsyncConstants('FETCH_CLUSTER');

export function fetchCluster(genomeId, threshold) {
  return {
    // type: FETCH_CLUSTER,
    type: FETCH_COLLECTION,
    payload: {
      promise: api.fetchCluster(genomeId, threshold),
    },
  };
}
