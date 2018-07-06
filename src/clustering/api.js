import { fetchJson, fetchJsonXhr } from '../utils/Api';

import config from '../app/config';

export function fetchGenome(id) {
  return fetchJson('GET', `/api/genome/${id}`);
}

export function requestClustering(id) {
  return fetchJsonXhr('POST', `/api/genome/${id}/clusters`, { clientId: config.clientId });
}

export function fetchClusters(id) {
  return fetchJson('GET', `/api/genome/${id}/clusters`);
}

export function fetchClusterEdges(id, threshold, sts) {
  return fetchJson('POST', `/api/genome/${id}/clusters/edges`, { threshold, sts });
}
