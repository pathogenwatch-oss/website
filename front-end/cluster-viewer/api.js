import { fetchJson } from '../utils/Api';
import { formatGenomeRecords } from '~/collection-viewer/utils';

export function fetchCluster(genomeId, threshold) {
  console.log(`[Pathogenwatch] Fetching cluster for genome ${genomeId}`);
  return fetchJson('GET', `/api/clustering/${genomeId}?threshold=${threshold}`)
    .then(result => ({
      ...result,
      genomes: formatGenomeRecords(result.genomes),
    }));
}
