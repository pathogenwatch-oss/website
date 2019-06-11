import { fetchJson, fetchRaw } from '~/utils/Api';

import config from '~/app/config';
const { clientId } = config;

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
