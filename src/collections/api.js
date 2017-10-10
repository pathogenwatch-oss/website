import { fetchJson } from '../utils/Api';

export function fetchCollections(filter) {
  return fetchJson('GET', '/api/collection', filter);
}

export function fetchSummary(filter) {
  return fetchJson('GET', '/api/collection/summary', filter);
}

export function binCollection(id, status) {
  return fetchJson('POST', `/api/collection/${id}/binned`, { status });
}
