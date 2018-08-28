import { fetchJson } from '../../utils/Api';

export function createCollectionRequest(genomes, organismId, metadata) {
  return fetchJson('PUT', '/api/collection', {
    organismId,
    ...metadata,
    genomeIds: genomes.map(_ => _.id),
  });
}

export function verify(genomes, organismId) {
  return fetchJson('POST', '/api/collection/verify', {
    organismId,
    genomeIds: genomes.map(_ => _.id),
  });
}
