import { fetchJson } from '../utils/Api';

export function fetchGenomes(query) {
  return fetchJson('GET', '/api/genome', query);
}

export function fetchSummary(filter) {
  return fetchJson('GET', '/api/genome/summary', filter);
}

export function binGenome(id, status) {
  return fetchJson('POST', `/api/genome/${id}/binned`, { status });
}
