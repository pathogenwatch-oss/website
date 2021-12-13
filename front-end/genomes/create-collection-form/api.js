import { fetchJson } from '../../utils/Api';

export function createCollectionRequest(genomes, organismId, organismName, metadata) {
  return fetchJson('PUT', '/api/collection', {
    organismId,
    organismName,
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
