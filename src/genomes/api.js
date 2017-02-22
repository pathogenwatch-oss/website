import { fetchJson } from '../utils/Api';

export function fetchGenomes(filter) {
  return fetchJson('GET', '/api/genome', filter);
}

export function fetchSummary({ prefilter }) {
  return fetchJson('GET', '/api/genome/summary', { prefilter });
}
