import { fetchJson, fetchJsonXhr } from '../../utils/Api';

import config from '../../app/config';

export function fetchGenome(id) {
  return fetchJson('GET', `/api/genome/${id}`);
}

export function requestClustering(scheme) {
  return fetchJsonXhr('POST', '/api/clustering', { scheme, clientId: config.clientId });
}

export function fetchClusters(id) {
  return fetchJson('GET', `/api/genome/${id}/clusters`);
}

export function fetchClusterEdges(id, threshold, sts) {
  return fetchJsonXhr('POST', `/api/clustering/${id}/edges`, { threshold, sts });
}
