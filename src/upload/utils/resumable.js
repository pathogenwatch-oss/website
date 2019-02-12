import Resumable from 'resumablejs';
import hashWorker from 'workerize-loader?name=hash.[hash]!./hashWorker';
import config from '../../app/config';

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

export function processReads(genome, token, uploadedAt, dispatch) {
  const worker = hashWorker();
  worker.onmessage = ({ data }) => {
    if (data.type === 'UPLOAD_READS_PROGRESS') {
      data.payload.id = genome.id;
      dispatch(data);
    }
  };
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  const r = new Resumable({
    target: `${config.assemblerAddress}/chunks`,
    simultaneousUploads: 5,
    generateUniqueIdentifier: file => worker.hash(file),
    headers,
  });
  r.on('chunkingProgress', (file, message) => {
    dispatch({
      type: 'UPLOAD_READS_PROGRESS',
      payload: {
        stage: 'PREPARE',
        id: genome.id,
        file: file.fileName,
        progress: message * 100,
      },
    });
  });
  r.on('fileProgress', file => {
    dispatch({
      type: 'UPLOAD_READS_PROGRESS',
      payload: {
        stage: 'UPLOAD',
        id: genome.id,
        file: file.fileName,
        progress: file.progress() * 100,
      },
    });
  });
  return new Promise((resolve, reject) => {
    r.on('error', (message, file) => {
      reject({ message, file });
    });
    r.on('complete', () => {
      send('PATCH', '/api/pipelines', headers, {
        session: uploadedAt,
        genomeId: genome.id,
        status: 'READS_UPLOADED',
      }).then(response => {
        if (response.status !== 200) {
          reject({ message: response.statusText });
        } else {
          resolve();
        }
      });
    });
    const files = Object.values(genome.files);
    r.on('filesAdded', addedFiles => {
      send('POST', '/api/pipelines', headers, {
        session: uploadedAt,
        genomeId: genome.id,
        files: addedFiles.map(f => ({
          filename: f.fileName,
          fileId: f.uniqueIdentifier,
        })),
      })
        .then(response => {
          if (response.status !== 201) {
            reject({ message: response.statusText });
          } else {
            r.upload();
          }
        })
        .catch(e => reject({ message: e.message }));
    });
    r.addFiles(files);
  });
}
