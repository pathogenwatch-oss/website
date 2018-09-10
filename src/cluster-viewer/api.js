import { fetchJson } from '../utils/Api';

export function fetchCluster(genomeId, threshold) {
  console.log(`[Pathogenwatch] Fetching cluster for genome ${genomeId}`);
  return fetchJson('GET', `/api/clustering/${genomeId}?threshold=${threshold}`);
}
