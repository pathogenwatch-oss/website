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

export async function uploadReads(genome, progressFn) {
  // FIXME do some retries
  const { id, files = [] } = genome;

  const progressPerFile = Math.floor(100 / files.length);

  for (let i = 0; i < files.length; i++) {
    const fileProgress = (p) => { progressFn(progressPerFile * (i + p / 100)); };

    const file = files[i];
    const { name: fileName, handle } = file;
    const formData = new FormData();
    formData.append('fileName', fileName);
    formData.append('content', handle);

    await fetchRaw({
      method: 'PUT',
      path: `/api/genome/${id}/reads?${$.param({ clientId })}`,
      contentType: false,
      data: formData,
      processData: false,
      progressFn: fileProgress,
    });
  }
}

export function uploadComplete(id) {
  return fetchJson('POST', `/api/genome/${id}/uploaded`);
}

export function update(id, metadata) {
  return fetchJson('POST', `/api/genome/${id}`, metadata);
}
