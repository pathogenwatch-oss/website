import { fetchJson } from '../utils/Api';

export function fetchCluster(genomeId, threshold) {
  console.log(`[WGSA] Fetching cluster for genome ${genomeId}`);
  return fetchJson('GET', `/api/genome/${genomeId}/cluster?threshold=${threshold}`)
    .then(result => ({
      ...result,
      __isCluster: true,
    }));
}
