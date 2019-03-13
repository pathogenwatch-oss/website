import { fetchJson } from '../utils/Api';

export function initialise(genomes, uploadedAt) {
  return fetchJson(
    'PUT',
    `/api/genome?uploadedAt=${uploadedAt}`,
    genomes.map(_ => ({
      id: _.id,
      type: _.type,
      files: _.file ? [ _.file.name ] : Object.keys(_.files),
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

export function fetchQueuePosition(uploadedAt) {
  return fetchJson('GET', `/api/upload/${uploadedAt}/position`);
}
