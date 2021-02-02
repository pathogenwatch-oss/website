import { fetchJson } from '~/utils/Api';

import { formatGenomeRecords } from '../utils';

export function getTree(collectionId, name) {
  return fetchJson('GET', `/api/collection/${collectionId}/tree/${encodeURIComponent(name)}`)
    .then(result => ({
      ...result,
      genomes: formatGenomeRecords(result.genomes),
    }));
}

export function fetchTreePosition(date) {
  return fetchJson('GET', `/api/collection/position/${date}`);
}
