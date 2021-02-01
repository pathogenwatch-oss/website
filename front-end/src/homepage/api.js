import { fetchJson } from '../utils/Api';

export function getShowcaseCollections() {
  return fetchJson('GET', '/api/showcase');
}
