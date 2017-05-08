import { fetchJson, fetchRaw } from '../../utils/Api';

export function upload({ file, uploadedAt }, data, progressFn) {
  return fetchRaw(
    'PUT',
    `/api/genome?${$.param({ name: file.name, uploadedAt })}`,
    data instanceof Uint8Array ? 'application/zip' : 'text/plain',
    data,
    progressFn
  );
}

export function update(id, metadata) {
  return fetchJson('POST', `/api/genome/${id}`, metadata);
}
