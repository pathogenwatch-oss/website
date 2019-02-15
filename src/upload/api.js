import { fetchJson, fetchRaw } from '../utils/Api';

import config from '../app/config';
const { clientId, assemblerAddress } = config;

export function fetchLimits(token) {
  return fetch(`${assemblerAddress}/api/account`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then(response => {
    if (response.status === 200) {
      return response.json();
    }
    throw new Error(response.statusText);
  });
}

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

export function upload({ id }, data, progressFn) {
  return fetchRaw(
    'PUT',
    `/api/genome/${id}/assembly?${$.param({ clientId })}`,
    data instanceof Uint8Array ? 'application/zip' : 'text/plain',
    data,
    progressFn
  );
}

export function uploadComplete(id) {
  return fetchJson('POST', `/api/genome/${id}/uploaded`);
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
