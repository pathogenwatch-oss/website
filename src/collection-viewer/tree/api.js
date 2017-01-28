import { fetchJson } from '../../utils/Api';

export function getSubtree(collectionId, subtreeName) {
  return fetchJson('GET', `/api/collection/${collectionId}/subtree/${subtreeName}`);
}
