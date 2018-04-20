import { fetchJson } from '../../utils/Api';

import config from '../../app/config';

export function fetchGenome(id) {
  return fetchJson('GET', `/api/genome/${id}`);
}

export function requestClustering(scheme) {
  return fetchJson('POST', '/api/clustering', { scheme, clientId: config.clientId });
}
