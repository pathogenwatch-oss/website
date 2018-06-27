import { createAsyncConstants } from '../../actions';

import * as api from './api';

export const SHOW_GENOME_REPORT = createAsyncConstants('SHOW_GENOME_REPORT');

export function showGenomeReport(id, name) {
  return {
    type: SHOW_GENOME_REPORT,
    payload: {
      name,
      promise: api.fetchGenome(id),
    },
  };
}

export const CLOSE_GENOME_REPORT = 'CLOSE_GENOME_REPORT';

export function closeReport() {
  return {
    type: CLOSE_GENOME_REPORT,
  };
}

export const REQUEST_CLUSTERING = createAsyncConstants('REQUEST_CLUSTERING');

export function requestClustering(scheme) {
  return {
    type: REQUEST_CLUSTERING,
    payload: {
      promise: api.requestClustering(scheme).then(([ , , { status } ]) => ({ statusCode: status })),
    },
  };
}

export const UPDATE_CLUSTERING_PROGRESS = 'UPDATE_CLUSTERING_PROGRESS';

export function updateClusteringProgress(payload) {
  return {
    type: UPDATE_CLUSTERING_PROGRESS,
    payload,
  };
}

export const FETCH_CLUSTERS = createAsyncConstants('FETCH_CLUSTERS');

export function fetchClusters(genomeId) {
  return {
    type: FETCH_CLUSTERS,
    payload: {
      promise: api.fetchClusters(genomeId),
    },
  };
}

export const UPDATE_CLUSTERING_THRESHOLD = 'UPDATE_CLUSTERING_THRESHOLD'

export function updateClusteringThreshold(threshold) {
  return {
    type: UPDATE_CLUSTERING_THRESHOLD,
    payload: threshold,
  };
}

export const UPDATE_CLUSTERING_EDGES = createAsyncConstants('UPDATE_CLUSTERING_EDGES');

export function fetchClusterEdges(scheme, genomeId, threshold, sts) {
  return {
    type: UPDATE_CLUSTERING_EDGES,
    payload: {
      promise: api.fetchClusterEdges(scheme, genomeId, threshold, sts),
    },
  };
}
