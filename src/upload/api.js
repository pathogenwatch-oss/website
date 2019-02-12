import { fetchJson, fetchRaw } from '../utils/Api';

import config from '../app/config';

export function initialise(genomes, uploadedAt) {
  // console.log({ genomes });
  // throw new Error();
  return fetchJson(
    'PUT',
    `/api/genome?uploadedAt=${uploadedAt}`,
    genomes.map(_ => ({
      id: _.id,
      name: _.name,
      ..._.metadata,
    }))
  );
}

export function upload({ file, uploadedAt }, data, progressFn) {
  return fetchRaw(
    'PUT',
    `/api/genome?${$.param({
      name: file.name,
      uploadedAt,
      clientId: config.clientId,
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
