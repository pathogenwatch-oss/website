import { fetchJson, fetchRaw } from '~/utils/Api';

import config from '~/app/config';

const { clientId } = config;

export function uploadAssembly({ id }, data, progressFn) {
  return fetchRaw({
    method: 'PUT',
    path: `/api/genome/${id}/assembly?${$.param({ clientId })}`,
    contentType: data instanceof Uint8Array ? 'application/zip' : 'text/plain',
    data,
    progressFn,
  });
}

export function uploadComplete(id) {
  return fetchJson('POST', `/api/genome/${id}/uploaded?${$.param({ clientId })}`);
}

export function update(id, metadata) {
  return fetchJson('POST', `/api/genome/${id}`, metadata);
}
