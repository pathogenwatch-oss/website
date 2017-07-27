import { fetchJson } from '../utils/Api';
import { shouldNotFetch } from './utils';

function skipFetch(filter, defaultValue) {
  if (shouldNotFetch(filter)) {
    return Promise.resolve(defaultValue);
  }
  return false;
}

export function fetchGenomes(filter) {
  return skipFetch(filter, []) || fetchJson('GET', '/api/genome', filter);
}

export function fetchSummary(filter) {
  return skipFetch(filter, {}) ||
    fetchJson('GET', '/api/genome/summary', filter);
}

export function binGenome(id, status) {
  return fetchJson('POST', `/api/genome/${id}/binned`, { status });
}
