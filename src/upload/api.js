import { fetchJson, fetchRaw } from '../utils/Api';

export function initialise(genomes, uploadedAt) {
  return fetchJson(
    'PUT',
    `/api/genome?uploadedAt=${uploadedAt}`,
    genomes.map(_ => ({
      id: _.id,
      type: _.type,
      files: _.file ? [ _.file.name ] : _.files.map(f => f.name),
      metadata: {
        name: _.name,
        ..._.metadata,
      },
    }))
  );
}

export function upload({ id, uploadedAt }, data, progressFn) {
  return fetchRaw(
    'PUT',
    `/api/genome/${id}/assembly?${$.param({
      clientId: uploadedAt,
    })}`,
    data instanceof Uint8Array ? 'application/zip' : 'text/plain',
    data,
    progressFn
  );
}

export function update(id, metadata) {
  return fetchJson('POST', `/api/genome/${id}`, metadata);
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
