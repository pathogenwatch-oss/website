import { createAsyncConstants } from '../actions';

import * as api from './api';

export const REQUEST_BUILD_CLUSTERS = createAsyncConstants('REQUEST_BUILD_CLUSTERS');
export const SET_CLUSTERING_PROGRESS = 'SET_CLUSTERING_PROGRESS';
export const FETCH_CLUSTERS = createAsyncConstants('FETCH_CLUSTERS');
export const FETCH_CLUSTER_EDGES = createAsyncConstants('FETCH_CLUSTER_EDGES');
export const RUN_CLUSTER_LAYOUT = createAsyncConstants('RUN_CLUSTER_LAYOUT');
export const SET_CLUSTER_THRESHOLD = 'SET_CLUSTER_THRESHOLD';
export const SET_CLUSTER_GENOME = 'SET_CLUSTER_GENOME';
export const SKIP_NETWORK = 'SKIP_NETWORK';

export function build(genomeId) {
  return {
    type: REQUEST_BUILD_CLUSTERS,
    payload: {
      promise: api.requestClustering(genomeId).then(([ , , { status } ]) => ({ statusCode: status })),
    },
  };
}

export function updateProgress(payload) {
  return {
    type: SET_CLUSTERING_PROGRESS,
    payload,
  };
}

export function fetch(genomeId) {
  return {
    type: FETCH_CLUSTERS,
    payload: {
      promise: api.fetchClusters(genomeId),
    },
  };
}

export function fetchEdges(genomeId, threshold, sts) {
  return {
    type: FETCH_CLUSTER_EDGES,
    payload: {
      promise: api.fetchClusterEdges(genomeId, threshold, sts),
    },
  };
}

export function setThreshold(threshold) {
  return {
    type: SET_CLUSTER_THRESHOLD,
    payload: threshold,
  };
}

export function setGenomeId(genomeId) {
  return {
    type: SET_CLUSTER_THRESHOLD,
    payload: genomeId,
  };
}

export function runLayout(nEdges) {
  return {
    type: RUN_CLUSTER_LAYOUT,
    payload: {
      promise: new Promise(resolve => {
        const timeout = Math.min(Math.max(1000, nEdges / 5), 10000);
        setTimeout(resolve, timeout);
      }),
    },
  };
}

export function skipNetwork(message) {
  return {
    type: SKIP_NETWORK,
    payload: message,
  };
}
