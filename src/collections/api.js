import { fetchJson } from '../utils/Api';

export function fetchCollections(filter) {
  return fetchJson('GET', '/api/collection', filter);
}

export function fetchSummary({ prefilter }) {
  return fetchJson('GET', '/api/collection/summary', { prefilter });
}
