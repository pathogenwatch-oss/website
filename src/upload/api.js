import { fetchJson } from '../utils/Api';
import config from '~/app/config';

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

export function fetchUsage(token) {
  return fetch(`${config.assemblerAddress}/api/account`, {
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
