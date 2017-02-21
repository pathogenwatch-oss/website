import { fetchJson } from '../utils/Api';

export function fetchGenomes() {
  return fetchJson('GET', '/api/genome');
}

export function fetchSummary() {
  return fetchJson('GET', '/api/genome/summary');
}
