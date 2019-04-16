import Resumable from 'resumablejs';
import hashWorker from 'workerize-loader?name=hash.[hash]!./hashWorker';
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

export function upload(genome, { token, uploadedAt }, dispatch) {
  const worker = hashWorker();
  worker.onmessage = ({ data }) => {
    if (data.progress) {
      dispatch(
        uploadReadsProgress('IDENTIFY', genome.id, data.file, data.progress)
      );
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
    dispatch(
      uploadReadsProgress('PREPARE', genome.id, file.fileName, message * 100)
    );
  });
  r.on('chunkingComplete', file => {
    dispatch(uploadReadsProgress('PREPARE', genome.id, file.fileName, 100));
  });
  r.on('fileProgress', file => {
    dispatch(
      uploadReadsProgress(
        'UPLOAD',
        genome.id,
        file.fileName,
        file.progress() * 100
      )
    );
  });
  return new Promise((resolve, reject) => {
    let alreadyAssembled = false;
    r.on('error', (message, file) => {
      reject({ message, file });
    });
    r.on('complete', () => {
      const promises = [ uploadComplete(genome.id) ];
      if (!alreadyAssembled) {
        promises.push(
          send('PATCH', '/api/pipelines', headers, {
            session: uploadedAt,
            genomeId: genome.id,
            status: 'READS_UPLOADED',
          }).then(response => {
            if (response.status !== 200) {
              reject({ message: response.statusText });
            }
          })
        );
      }
      Promise.all(promises).then(resolve);
    });
    r.on('filesAdded', addedFiles => {
      console.log(genome.recovery);
      if (genome.recovery) {
        for (const { fileId } of genome.recovery) {
          let filename = null;
          for (const file of addedFiles) {
            if (file.uniqueIdentifier === fileId) {
              break;
            }
            filename = file.fileName;
          }
          if (filename) {
            reject({
              message: `${filename} does not match the original file, please try again.`,
            });
            return;
          }
        }
        r.upload();
        return;
      }

      send('POST', '/api/pipelines', headers, {
        session: uploadedAt,
        genomeId: genome.id,
        callback: `${origin}/api/genome/${
          genome.id
        }/assembly?clientId=${clientId}`,
        files: addedFiles.map(f => ({
          filename: f.fileName,
          fileId: f.uniqueIdentifier,
          totalChunks: f.chunks.length,
        })),
      })
        .then(response => {
          if (response.status === 304) {
            alreadyAssembled = true;
            r.fire('complete');
          } else if (response.status !== 201) {
            reject({ message: response.statusText });
          } else {
            r.upload();
          }
        })
        .catch(e => reject({ message: e.message }));
    });
    r.addFiles(Object.values(genome.files).map(_ => _.handle));
  });
}

export function fetchSession(uploadedAt, token) {
  return new Promise((resolve, reject) =>
    send('GET', `/api/sessions/${uploadedAt}`, {
      Authorization: `Bearer ${token}`,
    }).then(response => {
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
