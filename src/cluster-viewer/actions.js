import * as api from './api';

import { FETCH_COLLECTION } from '../collection-viewer/actions';

export function fetchCluster(genomeId, threshold) {
  return {
    type: FETCH_COLLECTION,
    payload: {
      promise:
        api.fetchCluster(genomeId, threshold)
          .then(result => ({ ...result, isClusterView: true })),
    },
  };
}
