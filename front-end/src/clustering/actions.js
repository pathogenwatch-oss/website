import { createAsyncConstants } from '../actions';

import * as api from './api';

export const REQUEST_BUILD_CLUSTERS = createAsyncConstants('REQUEST_BUILD_CLUSTERS');
export const SET_CLUSTERING_PROGRESS = 'SET_CLUSTERING_PROGRESS';
export const FETCH_CLUSTERS = createAsyncConstants('FETCH_CLUSTERS');
export const FETCH_CLUSTER_EDGES = createAsyncConstants('FETCH_CLUSTER_EDGES');
export const RUN_CLUSTER_LAYOUT = createAsyncConstants('RUN_CLUSTER_LAYOUT');
export const SET_CLUSTER_THRESHOLD = 'SET_CLUSTER_THRESHOLD';
export const SET_CLUSTER_GENOME = 'SET_CLUSTER_GENOME';
export const SKIP_LAYOUT = 'SKIP_LAYOUT';

export function build(genomeId) {
  return {
    type: REQUEST_BUILD_CLUSTERS,
    payload: {
      promise: api.requestClustering(genomeId),
      genomeId,
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
      genomeId,
    },
  };
}

export function fetchEdgeMatrix(genomeId, scheme, version, threshold, sts) {
  return {
    type: FETCH_CLUSTER_EDGES,
    payload: {
      promise: api.fetchClusterEdges(genomeId, scheme, version, threshold, sts),
      genomeId,
      threshold,
      sts,
      scheme,
      version,
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

function getNodeCoordinates(nodes) {
  const locations = {};
  for (const node of nodes) {
    const { x, y, id } = node;
    locations[id] = { x, y };
  }
  return locations;
}

export function startLayout() {
  return {
    type: RUN_CLUSTER_LAYOUT.ATTEMPT,
    payload: {},
  };
}

export function stopLayout(layout) {
  return {
    type: RUN_CLUSTER_LAYOUT.SUCCESS,
    payload: {
      result: {
        coordinates: layout,
      },
    },
  };
}

export function skipLayout(nodes) {
  return {
    type: SKIP_LAYOUT,
    payload: getNodeCoordinates(nodes),
  };
}
