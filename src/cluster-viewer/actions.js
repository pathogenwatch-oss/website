import * as api from './api';

import { FETCH_COLLECTION } from '../collection-viewer/actions';

export function fetchCluster(genomeId, threshold) {
  return {
    type: FETCH_COLLECTION,
    payload: {
      isClusterView: true,
      genomeId,
      threshold,
      promise:
        api.fetchCluster(genomeId, threshold)
          .then(result => ({ ...result, isClusterView: true })),
    },
  };
}

export const CLUSTER_TOGGLE_LASSO_ACTIVE = 'CLUSTER_TOGGLE_LASSO_ACTIVE';

export function toggleLassoActive() {
  return {
    type: CLUSTER_TOGGLE_LASSO_ACTIVE,
    payload: {},
  };
}

export const CLUSTER_SET_LASSO_PATH = 'CLUSTER_SET_LASSO_PATH';

export function setLassoPath(path = []) {
  return {
    type: CLUSTER_SET_LASSO_PATH,
    payload: path,
  };
}

export const CLUSTER_SELECT_NODES = 'CLUSTER_SELECT_NODES';

export function selectNodes(ids, append) {
  return {
    type: CLUSTER_SELECT_NODES,
    payload: {
      ids, append,
    },
  };
}
