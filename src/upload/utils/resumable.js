import Resumable from 'resumablejs';

import hashWorker from 'workerize-loader?name=hash-worker.[hash].js!./hashWorker';

import config from '../../app/config';

export function processReads(genome, token, dispatch) {
  const worker = hashWorker();
  worker.onmessage = ({ data }) => {
    if (data.type === 'UPLOAD_READS_PROGRESS') {
      data.payload.id = genome.id;
      dispatch(data);
    }
  };
  const r = new Resumable({
    target: `${config.assemblerAddress}/upload`,
    simultaneousUploads: 5,
    generateUniqueIdentifier: file => worker.hash(file),
    headers: {
      Authorization: `Bearer ${token}`,
    },
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
    r.on('complete', resolve);
    const files = Object.values(genome.files);
    r.on('filesAdded', () => r.upload());
    r.addFiles(files);
  });
}
