import { fetchJson } from '../utils/Api';

export function initialise(genomes, uploadedAt) {
  return fetchJson(
    'PUT',
    `/api/genome?uploadedAt=${uploadedAt}`,
    genomes.map(_ => ({
      id: _.id,
      type: _.type,
      files: _.files.map(f => f.name),
      metadata: {
        name: _.name,
        ..._.metadata,
      },
    }))
  );
}

export function fetchGenomes(uploadedAt) {
  return fetchJson('GET', `/api/upload/${uploadedAt}`);
}

export function fetchUploads() {
  return fetchJson('GET', '/api/upload');
}
