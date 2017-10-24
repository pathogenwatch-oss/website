import { fetchJson } from '../../utils/Api';

export function createCollectionRequest(genomes, organismId, metadata) {
  return fetchJson('PUT', '/api/collection', {
    organismId,
    ...metadata,
    genomeIds: genomes.map(_ => _.id),
  });
}
