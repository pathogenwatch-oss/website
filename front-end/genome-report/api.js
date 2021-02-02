import { fetchJson } from '../utils/Api';

export function fetchGenome(id, collectionId = '') {
  return fetchJson('GET', `/api/genome/${id}?collectionId=${collectionId}`);
}
