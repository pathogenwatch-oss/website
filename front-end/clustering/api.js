import { fetchJson } from '../utils/Api';

import config from '../app/config';

export function fetchGenome(id) {
  return fetchJson('GET', `/api/genome/${id}`);
}

export function requestClustering(id) {
  return fetchJson('POST', `/api/genome/${id}/clusters`, { clientId: config.clientId });
}

export function fetchClusters(id) {
  return fetchJson('GET', `/api/genome/${id}/clusters`);
}

export function fetchClusterEdges(id, scheme, version, organismId, threshold, sts) {
  return fetchJson('POST', `/api/genome/${id}/clusters/edges`, { scheme, version, organismId, threshold: Number(threshold), sts });
}
