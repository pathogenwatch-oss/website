import { uploadComplete } from '../files/api';
import config from '~/app/config';

const { origin = window.location.origin, clientId } = config;

function send(method, path, headers, data) {
  return fetch(`${config.assemblerAddress}${path}`, {
    method,
    mode: 'cors',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
}

function uploadReadsProgress(stage, id, filename, progress) {
  return {
    type: 'UPLOAD_READS_PROGRESS',
    payload: {
      stage,
      id,
      filename,
      progress,
    },
  };
}

export function upload(genome, { uploadedAt }, dispatch) {

  throw new Error('FIXME');
}

export function fetchSession(uploadedAt, token) {
  return new Promise((resolve, reject) =>
    send('GET', `/api/sessions/${uploadedAt}`, {
      Authorization: `Bearer ${token}`,
    }).then((response) => {
      if (response.status === 200) {
        resolve(response.json());
      } else if (response.status === 404) {
        reject({ type: 'NOT_FOUND' });
      } else {
        reject({ message: response.statusText });
      }
    })
  );
}

export function fetchProgress(uploadedAt, token) {
  return new Promise((resolve, reject) =>
    send('GET', `/api/sessions/${uploadedAt}/progress`, {
      Authorization: `Bearer ${token}`,
    }).then((response) => {
      if (response.status === 200) {
        resolve(response.json());
      } else {
        reject({ message: response.statusText });
      }
    })
  );
}
