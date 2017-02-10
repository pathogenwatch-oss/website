import { fetchJson } from '../utils/Api';

export function fetchGenomes() {
  return fetchJson('GET', '/api/genome');
}
