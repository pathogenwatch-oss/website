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
      promise: api.requestClustering(scheme),
    },
  };
}
