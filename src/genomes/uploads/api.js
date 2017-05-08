import { fetchJson, fetchBinary } from '../../utils/Api';

export function upload({ file, uploadedAt }, data, progressFn) {
  return fetchBinary(
    'PUT',
    `/api/genome?${$.param({ name: file.name, uploadedAt })}`,
    data,
    progressFn
  )
  .then(response => response.json());
}

export function update(id, metadata) {
  return fetchJson('POST', `/api/genome/${id}`, metadata);
}
