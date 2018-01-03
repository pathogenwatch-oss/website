import { fetchJson } from '../../utils/Api';

export function getTree(collectionId, name) {
  return fetchJson('GET', `/api/collection/${collectionId}/tree/${name}`);
}

export function fetchTreePosition(date) {
  return fetchJson('GET', `/api/collection/position/${date}`);
}
