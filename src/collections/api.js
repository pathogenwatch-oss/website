import { fetchJson } from '../utils/Api';

export function fetch() {
  return fetchJson('GET', '/api/collection');
}
