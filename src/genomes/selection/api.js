import { fetchJson } from '../../utils/Api';

export function downloadGenomes(genomes) {
  return fetchJson('PUT', '/download/genome-archive', {
    type: 'genome',
    ids: genomes.map(_ => _.id),
  });
}

export function fetchDownloads(ids) {
  return fetchJson('GET', '/api/download', { ids: ids.join(',') });
}
