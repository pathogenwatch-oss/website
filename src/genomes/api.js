import { fetchJson } from '../utils/Api';

export function fetchList(query) {
  return fetchJson('GET', '/api/genome', query);
}

export function fetchMap(query) {
  return fetchJson('GET', '/api/genome/map', query);
}

export function fetchStats(query) {
  return fetchJson('GET', '/api/genome/stats', query);
}

export function fetchSummary(filter) {
  return fetchJson('GET', '/api/genome/summary', filter);
}

export function binGenome(id, status) {
  return fetchJson('POST', `/api/genome/${id}/binned`, { status });
}

export function fetchSelection(ids) {
  return fetchJson('POST', '/api/genome/selection', ids);
}
